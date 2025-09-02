<template>
  <div ref="containerRef" class="canvas-container">
    <canvas ref="canvasRef" class="game-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
  import { useCanvasRenderer } from '@/composables/useCanvasRenderer';

  const { containerRef, canvasRef } = useCanvasRenderer();
</script>

<style scoped>
  .canvas-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .game-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
