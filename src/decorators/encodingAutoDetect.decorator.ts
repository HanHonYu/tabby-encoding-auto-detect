import { Injectable, Injector } from '@angular/core'
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal'
import { EncodingDetectionMiddleware } from '../middleware/encodingDetection.middleware'
import { EncodingDetectionService } from '../services/encodingDetection.service'

@Injectable()
export class EncodingAutoDetectDecorator extends TerminalDecorator {

    constructor (
        private injector: Injector,
    ) {
        super()
    }

    attach (tab: BaseTerminalTabComponent<any>): void {
        // 立即处理当前会话（如果存在）
        if (tab.session) {
            this.attachToSession(tab)
        }

        // 监听会话变化
        this.subscribeUntilDetached(tab, tab.sessionChanged$.subscribe(() => {
            this.attachToSession(tab)
        }))
    }

    private attachToSession (tab: BaseTerminalTabComponent<any>): void {
        if (!tab.session) {
            return
        }

        // 检查中间件堆栈是否存在
        const middlewareStack = (tab.session as any).middleware
        if (!middlewareStack) {
            return
        }

        try {
            // 创建编码检测中间件实例
            const encodingDetectionService = this.injector.get(EncodingDetectionService)
            const encodingMiddleware = new EncodingDetectionMiddleware(encodingDetectionService)

            // 将中间件添加到会话的中间件堆栈开头
            middlewareStack.unshift(encodingMiddleware)

        } catch (err) {
            console.error('[EncodingAutoDetect] Failed to add middleware:', err)
        }
    }
}
