// Type declarations for Tabby modules
import { InjectionToken } from '@angular/core'

declare const ConfigService: InjectionToken<any>
declare const Logger: any

declare module 'tabby-core' {
    export interface ConfigService {
        store: any
        writeRaw(config: string): Promise<void>
    }
    export interface LogService {
        create(name: string): Logger
    }
    export interface Logger {
        log(...args: any[]): void
        error(...args: any[]): void
        warn(...args: any[]): void
    }
    export class ConfigProvider {
        defaults: any
        platformDefaults: Record<string, any>
    }
}

declare module 'tabby-terminal' {
    export interface SessionMiddleware {
        feedFromSession(data: Buffer): void
        feedFromTerminal(data: Buffer): void
        outputToTerminal: any
        outputToSession: any
    }
    export interface BaseTerminalTabComponent<T> {
        session?: any
        sessionChanged$: any
        profile?: { name?: string }
    }
    export class TerminalDecorator {
        attach(tab: any): void
        protected subscribeUntilDetached(destroy: any, subscription: any): void
    }
}

declare module 'tabby-settings' {
    export class SettingsTabProvider {
        id: string
        icon: string
        title: string
    }
}
