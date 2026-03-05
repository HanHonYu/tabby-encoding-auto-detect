import { Injector } from '@angular/core';
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal';
export declare class EncodingAutoDetectDecorator extends TerminalDecorator {
    private injector;
    constructor(injector: Injector);
    attach(tab: BaseTerminalTabComponent<any>): void;
    private attachToSession;
}
