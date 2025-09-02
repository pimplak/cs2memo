export class CanvasService {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private animationFrameId: number | null = null;
    private isRunning = false;
    private lastTimestamp = 0;
    private pixelRatio = window.devicePixelRatio || 1;
    private resizeObserver: ResizeObserver | null = null;
    private containerElement: HTMLElement | null = null;

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
    }

    detach() {
        this.stop();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        window.removeEventListener('resize', this.handleWindowResize);
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

        // debug info
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
        ctx.fillText(`DPR: ${this.pixelRatio.toFixed(2)}`, 12, 18);
        ctx.fillText(`Size: ${Math.round(width)}x${Math.round(height)} CSS px`, 12, 36);
        ctx.fillText(`FPS: ${this.smoothedFps.toFixed(1)}`, 12, 54);
        ctx.fillText(`Render: ${this.lastRenderMs.toFixed(2)} ms`, 12, 72);
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
