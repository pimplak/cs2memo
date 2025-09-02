import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getCanvasService } from '@/services/CanvasService';

export function useCanvasRenderer() {
    const containerRef = ref<HTMLElement | null>(null);
    const canvasRef = ref<HTMLCanvasElement | null>(null);

    const service = getCanvasService();

    const start = () => {
        if (canvasRef.value) {
            service.attach(canvasRef.value, containerRef.value ?? undefined);
            service.start();
        }
    };

    const stop = () => {
        service.stop();
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
        start,
        stop,
    };
}
