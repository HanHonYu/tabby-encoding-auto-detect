/// <reference types="node" />
/// <reference types="node" />
import { SessionMiddleware } from 'tabby-terminal';
import { EncodingDetectionService } from '../services/encodingDetection.service';
export declare class EncodingDetectionMiddleware extends SessionMiddleware {
    private encodingDetectionService;
    private detectedEncoding;
    private autoSwitched;
    constructor(encodingDetectionService: EncodingDetectionService);
    feedFromSession(data: Buffer): void;
    feedFromTerminal(data: Buffer): void;
    private handleDetectionResult;
    private applyEncodingSwitch;
    private isValidUtf8;
    private tryAutoConvert;
    getDetectedEncoding(): string | null;
    reset(): void;
}
