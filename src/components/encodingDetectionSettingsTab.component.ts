import { Component, Inject } from '@angular/core'
import { ConfigService } from 'tabby-core'

/** @hidden */
@Component({
    templateUrl: './encodingDetectionSettingsTab.component.pug',
    styleUrls: ['./encodingDetectionSettingsTab.component.scss'],
})
export class EncodingDetectionSettingsTabComponent {
    enabled = true
    confidenceThreshold = 0.7
    sampleSize = 4096
    autoSwitchEncoding = true
    logDetectionResults = true
    preferredEncodings = ['UTF-8', 'GBK', 'GB2312', 'GB18030', 'Big5', 'Shift_JIS', 'EUC-KR']
    fallbackEncoding = 'UTF-8'

    availableEncodings = ['UTF-8', 'GBK', 'GB2312', 'GB18030', 'Big5', 'Shift_JIS', 'EUC-JP', 'EUC-KR', 'ISO-8859-1', 'Windows-1252']

    constructor (
        @Inject(ConfigService) public configService: ConfigService,
    ) {
        this.loadConfig()
    }

    loadConfig (): void {
        const saved = this.configService.store.encodingAutoDetect
        if (saved) {
            this.enabled = saved.enabled ?? true
            this.confidenceThreshold = saved.confidenceThreshold ?? 0.7
            this.sampleSize = saved.sampleSize ?? 4096
            this.autoSwitchEncoding = saved.autoSwitchEncoding ?? true
            this.logDetectionResults = saved.logDetectionResults ?? true
            this.preferredEncodings = saved.preferredEncodings ?? ['UTF-8', 'GBK', 'GB2312', 'GB18030', 'Big5', 'Shift_JIS', 'EUC-KR']
            this.fallbackEncoding = saved.fallbackEncoding ?? 'UTF-8'
        }
    }

    async saveConfig (): Promise<void> {
        // 使用更安全的方式更新配置：通过深拷贝创建新对象
        const newConfig = {
            ...this.configService.store,
            encodingAutoDetect: {
                enabled: this.enabled,
                confidenceThreshold: this.confidenceThreshold,
                sampleSize: this.sampleSize,
                autoSwitchEncoding: this.autoSwitchEncoding,
                logDetectionResults: this.logDetectionResults,
                preferredEncodings: this.preferredEncodings,
                fallbackEncoding: this.fallbackEncoding,
            },
        }
        
        // 使用ConfigService的writeRaw方法更新整个配置
        await this.configService.writeRaw(JSON.stringify(newConfig))
    }
}
