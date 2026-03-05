import { ConfigProvider } from 'tabby-core';
export declare class EncodingDetectionConfigProvider extends ConfigProvider {
    defaults: {
        encodingAutoDetect: {
            enabled: boolean;
            confidenceThreshold: number;
            sampleSize: number;
            autoSwitchEncoding: boolean;
            logDetectionResults: boolean;
            preferredEncodings: string[];
            fallbackEncoding: string;
        };
    };
    platformDefaults: Record<string, any>;
}
