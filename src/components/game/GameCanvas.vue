<template>
  <div ref="containerRef" class="canvas-container">
    <canvas ref="canvasRef" class="game-canvas"></canvas>
    <div v-if="state.isCompleted" class="win-overlay">
      <div class="win-card">
        <h2>Great job!</h2>
        <p>Moves: {{ state.movesCount }}</p>
        <button class="win-button" @click="handleNewGame">New Game</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';
import { useMemoryGame } from '@/composables/useMemoryGame';
import { computeGridLayout, hitTestTile } from '@/utils/layout';
import type { CanvasRenderContext, CanvasPointerHandlers } from '@/types/canvas';
import type { TileRect } from '@/types/layout';

const props = defineProps<{ rows: number; cols: number }>();
const { containerRef, canvasRef, renderCallback, pointerHandlers } = useCanvasRenderer();

// init with provided difficulty
const { state, revealTileByIndex, newGame } = useMemoryGame({ rows: props.rows, cols: props.cols });

const rectsRef = ref<TileRect[]>([]);
const flipProgress = ref<number[]>([]); // 0 = back, 1 = front
const FLIP_DURATION_MS = 260;

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function syncAnimArrays() {
  const n = state.tiles.length;
  if (flipProgress.value.length !== n) {
    const arr = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      arr[i] = state.tiles[i].isMatched || state.tiles[i].isRevealed ? 1 : 0;
    }
    flipProgress.value = arr;
  }
}

function updateAnimations(deltaMs: number) {
  const step = deltaMs / FLIP_DURATION_MS;
  for (let i = 0; i < state.tiles.length; i++) {
    const desired = state.tiles[i].isMatched || state.tiles[i].isRevealed ? 1 : 0;
    const current = flipProgress.value[i] ?? 0;
    if (desired > current) {
      flipProgress.value[i] = clamp01(current + step);
    } else if (desired < current) {
      flipProgress.value[i] = clamp01(current - step);
    }
  }
}

function draw(ctx: CanvasRenderContext) {
  const { ctx: g, width, height, deltaMs } = ctx;

  const layout = computeGridLayout(width, height, state.rows, state.cols, { padding: 24, gap: 14, aspect: 0.72 });
  rectsRef.value = layout.rects;
  syncAnimArrays();
  updateAnimations(deltaMs);

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

    const progress = clamp01(flipProgress.value[i] ?? 0);
    const theta = progress * Math.PI;
    const scaleX = Math.cos(theta);
    const showFront = progress >= 0.5;

    g.save();
    g.translate(r.x + r.width / 2, r.y + r.height / 2);
    g.scale(scaleX, 1);

    if (tile.isMatched) {
      g.fillStyle = '#2ecc71';
    } else if (showFront) {
      g.fillStyle = '#3498db';
    } else {
      g.fillStyle = '#7f8c8d';
    }
    g.fillRect(-r.width / 2, -r.height / 2, r.width, r.height);

    g.strokeStyle = 'rgba(255,255,255,0.25)';
    g.lineWidth = 1;
    g.strokeRect(-r.width / 2 + 0.5, -r.height / 2 + 0.5, r.width - 1, r.height - 1);

    if (showFront) {
      g.fillStyle = 'white';
      g.fillText(String(tile.pairId), 0, 0);
    }

    g.restore();
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

function handleNewGame() {
  newGame();
}

// React to difficulty changes via props
watchEffect(() => {
  const r = props.rows;
  const c = props.cols;
  if (r > 0 && c > 0 && (r !== state.rows || c !== state.cols)) {
    newGame({ rows: r, cols: c });
  }
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

.win-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
}

.win-card {
  min-width: 240px;
  padding: 16px 20px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.win-card h2 {
  margin-bottom: 8px;
}

.win-card p {
  margin-bottom: 12px;
  opacity: 0.9;
}

.win-button {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.win-button:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
