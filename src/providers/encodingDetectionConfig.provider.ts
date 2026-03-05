import { Injectable } from '@angular/core'
import { ConfigProvider } from 'tabby-core'

@Injectable()
export class EncodingDetectionConfigProvider extends ConfigProvider {
  defaults = {
    encodingAutoDetect: {
      enabled: true,
      confidenceThreshold: 0.7,
      sampleSize: 4096,
      autoSwitchEncoding: true,
      logDetectionResults: true,
      preferredEncodings: ['UTF-8', 'GBK', 'GB2312', 'GB18030', 'Big5', 'Shift_JIS', 'EUC-KR'],
      fallbackEncoding: 'UTF-8',
    },
  }

  platformDefaults: Record<string, any> = {}
}
