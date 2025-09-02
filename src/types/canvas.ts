export type CanvasRenderContext = {
    ctx: CanvasRenderingContext2D;
    width: number; // CSS pixels coordinate space
    height: number; // CSS pixels coordinate space
    dpr: number;
    timestamp: number;
    deltaMs: number;
};

export type CanvasPointerEvent = {
    x: number; // CSS pixels within canvas
    y: number; // CSS pixels within canvas
    isPrimary: boolean;
    pointerId: number;
    button?: number;
    originalEvent: PointerEvent;
};

export type CanvasPointerHandlers = {
    onDown: (e: CanvasPointerEvent) => void;
    onUp: (e: CanvasPointerEvent) => void;
    onMove: (e: CanvasPointerEvent) => void;
    onLeave: (e: CanvasPointerEvent) => void;
};


