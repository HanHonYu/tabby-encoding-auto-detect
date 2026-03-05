import { SessionMiddleware } from 'tabby-terminal'
import { EncodingDetectionService } from '../services/encodingDetection.service'
import { EncodingDetectionResult } from '../api'

export class EncodingDetectionMiddleware extends SessionMiddleware {
    private detectedEncoding: string | null = null
    private autoSwitched = false

    constructor (
        private encodingDetectionService: EncodingDetectionService,
    ) {
        super()
        this.encodingDetectionService.onDetectionResult().subscribe((result: EncodingDetectionResult) => {
            this.handleDetectionResult(result)
        })
    }

    feedFromSession (data: Buffer): void {
        this.encodingDetectionService.addData(data)
        const config = this.encodingDetectionService.config

        // 如果插件未启用，直接传递数据
        if (!config.enabled) {
            this.outputToTerminal.next(data)
            return
        }

        // 如果已检测到编码且配置了自动切换，进行编码转换
        if (this.detectedEncoding && config.autoSwitchEncoding) {
            try {
                const convertedData = this.encodingDetectionService.convertEncoding(data, this.detectedEncoding, 'UTF-8')

                // 验证转换结果是否有效
                if (this.isValidUtf8(convertedData)) {
                    this.outputToTerminal.next(convertedData)
                    if (config.logDetectionResults) {
                        console.log(`[EncodingAutoDetect] Converted from ${this.detectedEncoding} to UTF-8`)
                    }
                } else {
                    // 如果转换结果无效，使用原始数据
                    this.outputToTerminal.next(data)
                }
                return
            } catch (err) {
                console.warn('[EncodingAutoDetect] Encoding conversion failed:', err)
            }
        }

        // 如果没有检测到编码，尝试进行智能转换
        if (config.autoSwitchEncoding) {
            const autoConverted = this.tryAutoConvert(data)
            if (autoConverted) {
                this.outputToTerminal.next(autoConverted)
                return
            }
        }

        this.outputToTerminal.next(data)
    }

    feedFromTerminal (data: Buffer): void {
        this.outputToSession.next(data)
    }

    private handleDetectionResult (result: EncodingDetectionResult): void {
        if (this.detectedEncoding === result.detectedEncoding) {
            return
        }

        this.detectedEncoding = result.detectedEncoding
        const config = this.encodingDetectionService.config

        console.log(`[EncodingDetectionMiddleware] Detected: ${result.detectedEncoding} (${(result.confidence * 100).toFixed(1)}% confidence)`)

        if (config.autoSwitchEncoding && !this.autoSwitched) {
            this.autoSwitched = true
            console.log(`[EncodingDetectionMiddleware] Auto-switching encoding to ${result.detectedEncoding}`)

            // 实际应用编码切换：通过修改终端配置
            this.applyEncodingSwitch(result.detectedEncoding)
        }
    }

    private applyEncodingSwitch (encoding: string): void {
        try {
            // 尝试通过Tabby的配置系统设置编码
            const tabbyConfig = (window as any).tabby?.config
            if (tabbyConfig) {
                // 尝试设置终端编码
                tabbyConfig.store.terminal.encoding = encoding
            }

            // 尝试通过DOM事件通知Tabby切换编码
            const encodingEvent = new CustomEvent('tabby-encoding-change', {
                detail: { encoding },
            })
            window.dispatchEvent(encodingEvent)

        } catch (err) {
            console.warn('[EncodingAutoDetect] Failed to apply encoding switch:', err)
        }
    }

    private isValidUtf8 (data: Buffer): boolean {
        try {
            // 尝试将数据解码为UTF-8字符串
            const text = data.toString('utf8')
            // 检查是否包含无效字符
            return !text.includes('\ufffd')
        } catch (err) {
            return false
        }
    }

    private tryAutoConvert (data: Buffer): Buffer | null {
        try {
            // 尝试常见的编码转换
            const commonEncodings = ['GBK', 'GB2312', 'GB18030', 'Big5', 'Shift_JIS', 'EUC-KR']

            for (const encoding of commonEncodings) {
                try {
                    const converted = this.encodingDetectionService.convertEncoding(data, encoding, 'UTF-8')
                    if (this.isValidUtf8(converted)) {
                        const sample = converted.toString('utf8').substring(0, 50)
                        // 检查是否包含可读字符（避免全是乱码）
                        if (/[\w\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(sample)) {
                            return converted
                        }
                    }
                } catch (err) {
                    // 忽略转换错误，继续尝试其他编码
                }
            }

            return null
        } catch (err) {
            return null
        }
    }

    getDetectedEncoding (): string | null {
        return this.detectedEncoding
    }

    reset (): void {
        this.detectedEncoding = null
        this.autoSwitched = false
        this.encodingDetectionService.clearBuffer()
    }
}
