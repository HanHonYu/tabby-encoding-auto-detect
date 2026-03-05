import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'
import { EncodingDetectionSettingsTabComponent } from '../components/encodingDetectionSettingsTab.component'

@Injectable()
export class EncodingDetectionSettingsTabProvider extends SettingsTabProvider {
    id = 'encoding-auto-detect'
    icon = 'fas fa-language'
    title = '编码检测'

    constructor () {
        super()
    }

    getComponentType (): any {
        return EncodingDetectionSettingsTabComponent
    }
}