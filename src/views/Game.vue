<template>
  <div class="cs-page">
    <div class="game-container">
      <div class="game-header">
        <router-link to="/" class="cs-button" style="gap:0.5rem;">
          <span class="button-accent"></span>
          <span>←</span>
          <span>Back</span>
        </router-link>
        <h1>Game</h1>
        <div class="spacer"></div>
        <div class="hud">
          <div class="hud-left">
            <span class="hud-item">
              <svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 3h10v2H7zM5 7h14v2H5zM9 11h10v2H9zM7 15h12v2H7zM5 19h14v2H5z" />
              </svg>
              <span class="label">Moves:</span>
              <span class="value">{{ hudMoves }}</span>
            </span>
            <span class="hud-item">
              <svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 8v5l3 3 .7-1.1-2.2-2V8z" />
                <path fill="currentColor"
                  d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
              </svg>
              <span class="label">Time:</span>
              <span class="value">{{ hudTime }}</span>
            </span>
          </div>
          <div class="hud-right">
            <button class="cs-button hud-btn sfx" @click="toggleSfx">
              <span class="button-accent"></span>
              <svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z" />
              </svg>
              <span class="hud-btn-label">{{ sfxEnabled ? 'SFX: ON' : 'SFX: OFF' }}</span>
            </button>
            <button class="cs-button hud-btn" @click="togglePause">
              <span class="button-accent"></span>
              <svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path v-if="!isPaused" fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z" />
                <path v-else fill="currentColor" d="M8 5v14l11-7z" />
              </svg>
              <span class="hud-btn-label">{{ isPaused ? 'Resume' : 'Pause' }}</span>
            </button>
            <button class="cs-button hud-btn" @click="newGame">
              <span class="button-accent"></span>
              <svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M13 3a9 9 0 1 1-9 9H2l3.5-3.5L9 12H6a7 7 0 1 0 7-7V3z" />
              </svg>
              <span class="hud-btn-label">New Game</span>
            </button>
          </div>
        </div>
      </div>
      <div class="game-content fade-in">
        <div class="canvas-wrapper cs-card">
          <GameCanvas ref="canvasApi" :rows="rows" :cols="cols" :seed="seed" @hud-update="onHudUpdate" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGameDifficultyStore } from '@/stores/gameDifficulty';
import GameCanvas from '@/components/game/GameCanvas.vue';
import { AudioService } from '@/services/AudioService';

defineOptions({
  name: 'GameView',
});

const route = useRoute();
const difficultyStore = useGameDifficultyStore();

const parsePositiveIntQuery = (value: unknown, fallback: number): number => {
  const raw = typeof value === 'string' ? value : Array.isArray(value) ? value[0] ?? '0' : '0';
  const n = parseInt(raw as string, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const rows = computed(() => {
  if (route.query.rows && route.query.cols) {
    return parsePositiveIntQuery(route.query.rows, 4);
  }
  return difficultyStore.gridDimensions.rows;
});

const cols = computed(() => {
  if (route.query.rows && route.query.cols) {
    return parsePositiveIntQuery(route.query.cols, 4);
  }
  return difficultyStore.gridDimensions.cols;
});

function parseSeed(value: unknown): string | number | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  if (trimmed.length === 0) return undefined;
  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber) && String(asNumber) === trimmed) return asNumber;
  return trimmed;
}

const seed = computed<string | number | undefined>(() => parseSeed(route.query.seed));

const canvasApi = ref<InstanceType<typeof GameCanvas> | null>(null);
const hudMoves = ref(0);
const hudTime = ref('00:00');
const isPaused = ref(false);

function togglePause() {
  canvasApi.value?.togglePause();
}

function newGame() {
  canvasApi.value?.newGame();
}

const sfxEnabled = ref(true);
onMounted(() => { sfxEnabled.value = AudioService.isEnabled(); });
function toggleSfx() {
  AudioService.setEnabled(!sfxEnabled.value);
  sfxEnabled.value = AudioService.isEnabled();
}

function onHudUpdate(payload: { moves: number; time: string; paused: boolean; completed: boolean }) {
  hudMoves.value = payload.moves;
  hudTime.value = payload.time;
  isPaused.value = payload.paused;
}
</script>

<style scoped>
.game-container {
  width: 100%;
}

.game-header {
  display: flex;
  align-items: center;
  padding: 1rem 0;
}

.game-header h1 {
  margin-left: 2rem;
  font-size: 2rem;
}

.spacer {
  flex: 1;
}

.hud {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hud-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--cs-text);
}

.hud-item {
  opacity: 0.95;
}

.hud-right {
  display: flex;
  gap: 0.6rem;
}

.hud-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  opacity: 0.9;
}

.hud-btn {
  padding: 0.5rem 0.8rem;
  min-width: 132px;
  justify-content: center;
}

.hud-btn.sfx {
  min-width: 124px;
}

.hud-btn-label {
  white-space: nowrap;
}

.game-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-height: calc(100vh - 88px);
  padding: 1rem 0;
}

.canvas-wrapper {
  width: 100%;
  height: calc(100vh - 132px);
  overflow: hidden;
}

@media (max-width: 1024px) {
  .game-header h1 {
    font-size: 1.6rem;
    margin-left: 1rem;
  }

  .hud {
    gap: 0.75rem;
  }

  .hud-left {
    gap: 0.75rem;
  }

  .hud-icon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }

  .hud-btn {
    min-width: 120px;
    padding: 0.45rem 0.7rem;
  }

  .hud-btn.sfx {
    min-width: 110px;
  }

  .canvas-wrapper {
    height: calc(100vh - 128px);
  }
}

@media (max-width: 768px) {
  .game-header {
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .spacer {
    display: none;
  }

  .hud {
    width: 100%;
    justify-content: space-between;
  }

  .hud-left {
    font-size: 0.95rem;
  }

  .hud-btn {
    flex: 1 1 auto;
    min-width: 0;
  }

  .hud-btn.sfx {
    flex: 0 0 auto;
    min-width: 112px;
  }

  .canvas-wrapper {
    height: calc(100vh - 170px);
  }
}

@media (max-width: 480px) {
  .game-header {
    padding: 0.75rem 0;
  }

  .game-header h1 {
    font-size: 1.3rem;
    margin-left: 0.5rem;
  }

  .hud {
    gap: 0.5rem;
  }

  .hud-left {
    gap: 0.5rem;
  }

  .hud-item .label {
    display: none;
  }

  .hud-item .value {
    display: inline;
  }

  .hud-item .hud-icon {
    margin-right: 0;
  }

  .hud-btn-label {
    display: none;
  }

  .hud-btn {
    min-width: 44px;
    padding: 0.45rem;
  }

  .hud-btn.sfx {
    min-width: 44px;
  }

  .canvas-wrapper {
    height: calc(100vh - 160px);
  }
}
</style>
