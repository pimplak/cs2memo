<template>
  <div ref="containerRef" class="canvas-container">
    <canvas ref="canvasRef" class="game-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';
import { useMemoryGame } from '@/composables/useMemoryGame';
import { computeGridLayout, hitTestTile } from '@/utils/layout';
import type { CanvasRenderContext, CanvasPointerHandlers } from '@/types/canvas';
import type { TileRect } from '@/types/layout';

const { containerRef, canvasRef, renderCallback, pointerHandlers } = useCanvasRenderer();

// basic grid for Story 1.2; can be made dynamic later
const { state, revealTileByIndex } = useMemoryGame({ rows: 4, cols: 3 });

const rectsRef = ref<TileRect[]>([]);

function draw(ctx: CanvasRenderContext) {
  const { ctx: g, width, height } = ctx;

  const layout = computeGridLayout(width, height, state.rows, state.cols, { padding: 24, gap: 14, aspect: 0.72 });
  rectsRef.value = layout.rects;

  // background board tint
  g.fillStyle = 'rgba(255,255,255,0.04)';
  g.fillRect(layout.boardRect.x, layout.boardRect.y, layout.boardRect.width, layout.boardRect.height);

  // draw tiles
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = '14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

  for (let i = 0; i < state.tiles.length; i++) {
    const tile = state.tiles[i];
    const r = layout.rects[i];

    if (tile.isMatched) {
      g.fillStyle = '#2ecc71';
    } else if (tile.isRevealed) {
      g.fillStyle = '#3498db';
    } else {
      g.fillStyle = '#7f8c8d';
    }
    g.fillRect(r.x, r.y, r.width, r.height);

    // border
    g.strokeStyle = 'rgba(255,255,255,0.25)';
    g.lineWidth = 1;
    g.strokeRect(r.x + 0.5, r.y + 0.5, r.width - 1, r.height - 1);

    // content (temporary): show pair id when revealed or matched
    if (tile.isRevealed || tile.isMatched) {
      g.fillStyle = 'white';
      g.fillText(String(tile.pairId), r.x + r.width / 2, r.y + r.height / 2);
    }
  }
}

renderCallback.value = (ctx: CanvasRenderContext) => {
  draw(ctx);
};

const handlers: Partial<CanvasPointerHandlers> = {
  onDown: (e) => {
    if (state.isInputLocked || state.isCompleted) return;
    const idx = hitTestTile(rectsRef.value, e.x, e.y);
    if (idx >= 0) {
      revealTileByIndex(idx);
    }
  },
};
pointerHandlers.value = handlers;

// ensure redraw on state changes
watchEffect(() => {
  // touch reactive dependencies to trigger renders via RAF callback usage
  void state.movesCount;
  void state.isInputLocked;
  void state.isCompleted;
  void state.tiles.length;
});
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
