import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TerminalDecorator } from 'tabby-terminal'
import TabbyCoreModule, { ConfigProvider } from 'tabby-core'
import { SettingsTabProvider } from 'tabby-settings'
import { EncodingAutoDetectDecorator } from './decorators/encodingAutoDetect.decorator'
import { EncodingDetectionService } from './services/encodingDetection.service'
import { EncodingDetectionConfigProvider } from './providers/encodingDetectionConfig.provider'
import { EncodingDetectionSettingsTabProvider } from './providers/encodingDetectionSettingsTab.provider'
import { EncodingDetectionSettingsTabComponent } from './components/encodingDetectionSettingsTab.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabbyCoreModule,
    ],
    declarations: [
        EncodingDetectionSettingsTabComponent,
    ],
    providers: [
        EncodingDetectionService,
        { provide: TerminalDecorator, useClass: EncodingAutoDetectDecorator, multi: true },
        { provide: ConfigProvider, useClass: EncodingDetectionConfigProvider, multi: true },
        { provide: SettingsTabProvider, useClass: EncodingDetectionSettingsTabProvider, multi: true },
    ],
})
export default class EncodingAutoDetectModule { }
