import { Injectable, Inject } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { ConfigService } from 'tabby-core'
import jschardet from 'jschardet'
import iconv from 'iconv-lite'
import { EncodingDetectionResult, EncodingDetectionConfig } from '../api'

@Injectable({ providedIn: 'root' })
export class EncodingDetectionService {
    private detectionResults$: Subject<EncodingDetectionResult> = new Subject()
    private buffer: Buffer[] = []
    private bufferSize = 0

    constructor (
        @Inject(ConfigService) private configService: ConfigService,
    ) {}

    get config (): EncodingDetectionConfig {
        const store = this.configService.store as { encodingAutoDetect?: EncodingDetectionConfig }
        return store.encodingAutoDetect ?? {
            enabled: true,
            confidenceThreshold: 0.7,
            sampleSize: 4096,
            autoSwitchEncoding: true,
            logDetectionResults: true,
            preferredEncodings: ['UTF-8', 'GBK', 'GB2312', 'GB18030', 'Big5', 'Shift_JIS', 'EUC-KR'],
            fallbackEncoding: 'UTF-8',
        }
    }

    onDetectionResult (): Observable<EncodingDetectionResult> {
        return this.detectionResults$.asObservable()
    }

    addData (data: Buffer): void {
        if (!this.config.enabled) {
            return
        }

        this.buffer.push(data)
        this.bufferSize += data.length

        if (this.bufferSize >= this.config.sampleSize) {
            this.detectEncoding()
            this.clearBuffer()
        }
    }

    clearBuffer (): void {
        this.buffer = []
        this.bufferSize = 0
    }

    private detectEncoding (): void {
        const buffers = this.buffer.map(b => Uint8Array.from(b))
        const sampleData = Buffer.concat(buffers).subarray(0, this.config.sampleSize)

        const result = jschardet.detect(sampleData.toString('binary'))

        if (!result.encoding || result.confidence < this.config.confidenceThreshold) {
            if (this.config.logDetectionResults) {
                console.log('[EncodingAutoDetect] Detection failed or confidence too low, using fallback encoding')
            }
            return
        }

        const normalizedEncoding = this.normalizeEncoding(result.encoding)

        if (this.config.preferredEncodings.includes(normalizedEncoding)) {
            const detectionResult: EncodingDetectionResult = {
                detectedEncoding: normalizedEncoding,
                confidence: result.confidence,
                sampleText: this.decodeSample(sampleData, normalizedEncoding),
            }

            if (this.config.logDetectionResults) {
                console.log(`[EncodingAutoDetect] Detected encoding: ${normalizedEncoding} (confidence: ${(result.confidence * 100).toFixed(1)}%)`)
            }

            this.detectionResults$.next(detectionResult)
        } else if (this.config.logDetectionResults) {
            console.log(`[EncodingAutoDetect] Detected ${normalizedEncoding} but not in preferred list`)
        }
    }

    private normalizeEncoding (encoding: string): string {
        const mapping: Record<string, string> = {
            GB18030: 'GB18030',
            GB2312: 'GB2312',
            GBK: 'GBK',
            BIG5: 'Big5',
            SHIFT_JIS: 'Shift_JIS',
            EUC_JP: 'EUC-JP',
            EUC_KR: 'EUC-KR',
            UTF8: 'UTF-8',
            UTF16: 'UTF-16',
            ISO88591: 'ISO-8859-1',
        }

        const upper = encoding.toUpperCase().replace(/[-_]/g, '')
        for (const [key, value] of Object.entries(mapping)) {
            if (key === upper) {
                return value
            }
        }

        return encoding
    }

    private decodeSample (data: Buffer, encoding: string): string {
        try {
            const decoded = iconv.decode(data, encoding)
            return decoded.substring(0, 100).replace(/[\x00-\x1F\x7F]/g, '')
        } catch (err) {
            return ''
        }
    }

    convertEncoding (data: Buffer, fromEncoding: string, toEncoding = 'UTF-8'): Buffer {
        try {
            // 如果源编码和目标编码相同，直接返回原数据
            if (fromEncoding.toLowerCase() === toEncoding.toLowerCase()) {
                return data
            }

            // 处理常见的编码别名
            const normalizedFromEncoding = this.normalizeEncoding(fromEncoding)
            const normalizedToEncoding = this.normalizeEncoding(toEncoding)

            // 如果编码相同，直接返回
            if (normalizedFromEncoding === normalizedToEncoding) {
                return data
            }

            // 使用iconv-lite进行编码转换
            const decoded = iconv.decode(data, normalizedFromEncoding)
            const encoded = iconv.encode(decoded, normalizedToEncoding)

            return encoded
        } catch (err) {
            console.error('[EncodingAutoDetect] Encoding conversion failed:', err)
            console.error(`[EncodingAutoDetect] Conversion details: ${fromEncoding} -> ${toEncoding}, data length: ${data.length}`)

            // 如果转换失败，尝试使用回退策略
            try {
                // 尝试直接使用UTF-8解码（如果源编码可能是UTF-8的变体）
                if (fromEncoding.toLowerCase().includes('utf')) {
                    return Buffer.from(data.toString('binary'), 'utf8')
                }

                // 尝试使用latin1作为最后手段
                return Buffer.from(data.toString('binary'), 'latin1')
            } catch (fallbackErr) {
                console.error('[EncodingAutoDetect] Fallback conversion also failed:', fallbackErr)
                return data
            }
        }
    }

    detectFromText (text: string): string {
        const patterns: { pattern: RegExp; encoding: string }[] = [
            { pattern: /[\u4e00-\u9fa5]/, encoding: 'GBK' },
            { pattern: /[\u3040-\u309f\u30a0-\u30ff]/, encoding: 'Shift_JIS' },
            { pattern: /[\uac00-\ud7af\u1100-\u11ff]/, encoding: 'EUC-KR' },
            { pattern: /[\u4e00-\u9fff]/, encoding: 'GB18030' },
        ]

        for (const { pattern, encoding } of patterns) {
            if (pattern.test(text)) {
                return encoding
            }
        }

        return 'UTF-8'
    }
}
