declare module 'jschardet' {
  export interface DetectionResult {
    encoding: string
    confidence: number
  }

  export function detect(buffer: string): DetectionResult
}

declare module 'iconv-lite' {
  import { Buffer } from 'buffer'

  export function decode(buffer: Buffer, encoding: string): string
  export function encode(str: string, encoding: string): Buffer
}
