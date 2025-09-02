import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getCanvasService } from '@/services/CanvasService';
import type { CanvasRenderContext, CanvasPointerHandlers } from '@/types/canvas';

export function useCanvasRenderer() {
    const containerRef = ref<HTMLElement | null>(null);
    const canvasRef = ref<HTMLCanvasElement | null>(null);

    const service = getCanvasService();
    const renderCallback = ref<((ctx: CanvasRenderContext) => void) | null>(null);
    const pointerHandlers = ref<Partial<CanvasPointerHandlers> | null>(null);

    const start = () => {
        if (canvasRef.value) {
            service.attach(canvasRef.value, containerRef.value ?? undefined);
            service.setRenderCallback(renderCallback.value);
            service.setPointerHandlers(pointerHandlers.value ?? null);
            service.start();
        }
    };

    const stop = () => {
        service.stop();
        service.setRenderCallback(null);
        service.setPointerHandlers(null);
        service.detach();
    };

    onMounted(() => {
        start();
        if (import.meta.hot) {
            import.meta.hot.accept();
            import.meta.hot.dispose(() => {
            });
        }
    });

    onBeforeUnmount(() => {
        stop();
    });

    return {
        containerRef,
        canvasRef,
        renderCallback,
        pointerHandlers,
        start,
        stop,
    };
}
