/// <reference types="node" />
/// <reference types="node" />
import { Observable } from 'rxjs';
import { ConfigService } from 'tabby-core';
import { EncodingDetectionResult, EncodingDetectionConfig } from '../api';
export declare class EncodingDetectionService {
    private configService;
    private detectionResults$;
    private buffer;
    private bufferSize;
    constructor(configService: ConfigService);
    get config(): EncodingDetectionConfig;
    onDetectionResult(): Observable<EncodingDetectionResult>;
    addData(data: Buffer): void;
    clearBuffer(): void;
    private detectEncoding;
    private normalizeEncoding;
    private decodeSample;
    convertEncoding(data: Buffer, fromEncoding: string, toEncoding?: string): Buffer;
    detectFromText(text: string): string | null;
}
