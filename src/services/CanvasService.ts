export class CanvasService {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private animationFrameId: number | null = null;
    private isRunning = false;
    private lastTimestamp = 0;
    private lastDeltaMs = 0;
    private pixelRatio = window.devicePixelRatio || 1;
    private resizeObserver: ResizeObserver | null = null;
    private containerElement: HTMLElement | null = null;
    private renderCallback: ((ctx: CanvasRenderContext) => void) | null = null;

    // pointer handlers
    private pointerHandlers: Partial<CanvasPointerHandlers> = {};
    private boundPointerDown?: (ev: PointerEvent) => void;
    private boundPointerUp?: (ev: PointerEvent) => void;
    private boundPointerMove?: (ev: PointerEvent) => void;
    private boundPointerLeave?: (ev: PointerEvent) => void;

    // debug info
    private lastRenderMs = 0;
    private smoothedFps = 0;

    attach(canvas: HTMLCanvasElement, container?: HTMLElement) {
        if (this.canvas === canvas && this.ctx) {
            this.resizeToDisplaySize();
            return;
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        window.removeEventListener('resize', this.handleWindowResize);

        this.canvas = canvas;
        this.containerElement = container ?? canvas.parentElement;
        this.ctx = canvas.getContext('2d');
        if (!this.ctx) return;

        this.resizeToDisplaySize();
        this.observeResize();

        window.addEventListener('resize', this.handleWindowResize);

        this.addPointerListeners();
    }

    detach() {
        this.stop();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        window.removeEventListener('resize', this.handleWindowResize);
        this.removePointerListeners();
        this.ctx = null;
        this.canvas = null;
        this.containerElement = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTimestamp = performance.now();
        const loop = (timestamp: number) => {
            if (!this.isRunning) return;
            const deltaMs = timestamp - this.lastTimestamp;
            this.lastTimestamp = timestamp;
            this.lastDeltaMs = deltaMs;

            const renderStart = performance.now();
            this.render();
            const renderEnd = performance.now();
            this.lastRenderMs = renderEnd - renderStart;

            if (deltaMs > 0) {
                const instantaneousFps = 1000 / deltaMs;
                this.smoothedFps =
                    this.smoothedFps === 0
                        ? instantaneousFps
                        : this.smoothedFps * 0.9 + instantaneousFps * 0.1;
            }
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.animationFrameId != null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private handleWindowResize = () => {
        const newRatio = window.devicePixelRatio || 1;
        if (newRatio !== this.pixelRatio) {
            this.pixelRatio = newRatio;
        }
        this.resizeToDisplaySize();
    };

    private observeResize() {
        if (!this.canvas) return;
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => {
                this.resizeToDisplaySize();
            });
            this.resizeObserver.observe(this.canvas);
        }
    }

    private resizeToDisplaySize() {
        if (!this.canvas || !this.ctx) return;

        const cssWidth = this.canvas.clientWidth || (this.containerElement?.clientWidth ?? 0);
        const cssHeight = this.canvas.clientHeight || (this.containerElement?.clientHeight ?? 0);

        const displayWidth = Math.max(1, Math.floor(cssWidth * this.pixelRatio));
        const displayHeight = Math.max(1, Math.floor(cssHeight * this.pixelRatio));

        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;

            this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
        }
    }

    private render() {
        if (!this.canvas || !this.ctx) return;

        const ctx = this.ctx;
        const width = this.canvas.width / this.pixelRatio;
        const height = this.canvas.height / this.pixelRatio;

        ctx.clearRect(0, 0, width, height);

        if (this.renderCallback) {
            this.renderCallback({
                ctx,
                width,
                height,
                dpr: this.pixelRatio,
                timestamp: this.lastTimestamp,
                deltaMs: this.lastDeltaMs,
            });
        }

        // debug info
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
        ctx.fillText(`DPR: ${this.pixelRatio.toFixed(2)}`, 12, 18);
        ctx.fillText(`Size: ${Math.round(width)}x${Math.round(height)} CSS px`, 12, 36);
        ctx.fillText(`FPS: ${this.smoothedFps.toFixed(1)}`, 12, 54);
        ctx.fillText(`Render: ${this.lastRenderMs.toFixed(2)} ms`, 12, 72);
    }

    // Public API
    setRenderCallback(cb: ((ctx: CanvasRenderContext) => void) | null): void {
        this.renderCallback = cb ?? null;
    }

    setPointerHandlers(handlers: Partial<CanvasPointerHandlers> | null): void {
        this.pointerHandlers = handlers ?? {};
    }

    getSize(): { width: number; height: number; dpr: number } {
        if (!this.canvas) {
            return { width: 0, height: 0, dpr: window.devicePixelRatio || 1 };
        }
        return { width: this.canvas.width / this.pixelRatio, height: this.canvas.height / this.pixelRatio, dpr: this.pixelRatio };
    }

    // Private helpers
    private addPointerListeners(): void {
        const canvas = this.canvas;
        if (!canvas) return;

        const toLocal = (ev: PointerEvent): CanvasPointerEvent => {
            const rect = canvas.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const y = ev.clientY - rect.top;
            return {
                x,
                y,
                isPrimary: ev.isPrimary,
                pointerId: ev.pointerId,
                button: typeof ev.button === 'number' ? ev.button : undefined,
                originalEvent: ev,
            };
        };

        this.boundPointerDown = (ev: PointerEvent) => {
            this.pointerHandlers.onDown?.(toLocal(ev));
        };
        this.boundPointerUp = (ev: PointerEvent) => {
            this.pointerHandlers.onUp?.(toLocal(ev));
        };
        this.boundPointerMove = (ev: PointerEvent) => {
            this.pointerHandlers.onMove?.(toLocal(ev));
        };
        this.boundPointerLeave = (ev: PointerEvent) => {
            this.pointerHandlers.onLeave?.(toLocal(ev));
        };

        canvas.addEventListener('pointerdown', this.boundPointerDown, { passive: true });
        canvas.addEventListener('pointerup', this.boundPointerUp, { passive: true });
        canvas.addEventListener('pointermove', this.boundPointerMove, { passive: true });
        canvas.addEventListener('pointerleave', this.boundPointerLeave, { passive: true });
        canvas.addEventListener('pointercancel', this.boundPointerLeave, { passive: true });
    }

    private removePointerListeners(): void {
        const canvas = this.canvas;
        if (!canvas) return;
        if (this.boundPointerDown) canvas.removeEventListener('pointerdown', this.boundPointerDown);
        if (this.boundPointerUp) canvas.removeEventListener('pointerup', this.boundPointerUp);
        if (this.boundPointerMove) canvas.removeEventListener('pointermove', this.boundPointerMove);
        if (this.boundPointerLeave) canvas.removeEventListener('pointerleave', this.boundPointerLeave);
        if (this.boundPointerLeave) canvas.removeEventListener('pointercancel', this.boundPointerLeave);
        this.boundPointerDown = undefined;
        this.boundPointerUp = undefined;
        this.boundPointerMove = undefined;
        this.boundPointerLeave = undefined;
    }
}

let singletonService: CanvasService | undefined = undefined;

type ViteHotData = { canvasService?: CanvasService };
type ViteHot = { data: ViteHotData; dispose: (cb: (data: ViteHotData) => void) => void };

if (import.meta.hot) {
    const hot = import.meta.hot as ViteHot;
    // restore from previous hot data if exists
    if (hot.data && hot.data.canvasService) {
        singletonService = hot.data.canvasService;
    }
    hot.dispose((data) => {
        data.canvasService = singletonService;
    });
}

export function getCanvasService(): CanvasService {
    if (!singletonService) {
        singletonService = new CanvasService();
    }
    return singletonService;
}

import type { CanvasRenderContext, CanvasPointerEvent, CanvasPointerHandlers } from '@/types/canvas';

