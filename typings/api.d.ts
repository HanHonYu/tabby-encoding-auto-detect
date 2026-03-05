/// <reference types="node" />
/// <reference types="node" />
export interface EncodingDetectionResult {
    detectedEncoding: string;
    confidence: number;
    sampleText?: string;
}
export interface EncodingDetectionConfig {
    enabled: boolean;
    confidenceThreshold: number;
    sampleSize: number;
    autoSwitchEncoding: boolean;
    logDetectionResults: boolean;
    preferredEncodings: string[];
    fallbackEncoding: string;
}
export declare function EncodingDetector(_data: Buffer, _config: EncodingDetectionConfig): EncodingDetectionResult | null;
