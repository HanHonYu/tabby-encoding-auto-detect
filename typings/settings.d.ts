import { SettingsTabProvider } from 'tabby-core';
import { EncodingDetectionSettingsTabComponent } from './components/encodingDetectionSettingsTab.component';
export declare class EncodingDetectionSettingsTabProvider extends SettingsTabProvider {
    id: string;
    name: "Encoding Detection";
    icon: string;
    component: typeof EncodingDetectionSettingsTabComponent;
}
