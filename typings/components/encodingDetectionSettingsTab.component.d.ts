import { ConfigService, TranslateService } from 'tabby-core';
/** @hidden */
export declare class EncodingDetectionSettingsTabComponent {
    configService: ConfigService;
    translate: TranslateService;
    enabled: boolean;
    confidenceThreshold: number;
    sampleSize: number;
    autoSwitchEncoding: boolean;
    logDetectionResults: boolean;
    preferredEncodings: string[];
    fallbackEncoding: string;
    availableEncodings: string[];
    constructor(configService: ConfigService, translate: TranslateService);
    loadConfig(): void;
    saveConfig(): Promise<void>;
}
