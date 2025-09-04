export interface CanvasRenderContext {
    ctx: CanvasRenderingContext2D
    width: number
    height: number
    dpr: number
    timestamp: number
    deltaMs: number
}

export interface CanvasPointerEvent {
    x: number
    y: number
    isPrimary: boolean
    pointerId: number
    button?: number
    originalEvent: PointerEvent
}

export interface CanvasPointerHandlers {
    onDown: (ev: CanvasPointerEvent) => void
    onUp: (ev: CanvasPointerEvent) => void
    onMove: (ev: CanvasPointerEvent) => void
    onLeave: (ev: CanvasPointerEvent) => void
}

export type CanvasRenderCallback = (context: CanvasRenderContext) => void
