<template>
  <div class="menu">
    <h1>CS2 Memo</h1>
    <div class="menu-controls">
      <div class="control-row">
        <label for="difficulty">difficulties</label>
        <select id="difficulty" v-model="difficulty">
          <option value="easy">Easy (4x4)</option>
          <option value="medium">Medium (4x6)</option>
          <option value="hard">Hard (6x6)</option>
        </select>
      </div>
      <div class="control-row">
        <label for="seed">Seed</label>
        <input id="seed" type="text" v-model="seed" placeholder="np. cs2-2025" />
      </div>
    </div>

    <div class="menu-buttons">
      <button class="menu-button" @click="play">
        <span>Play</span>
      </button>
      <router-link to="/history" class="menu-button">
        <span>History</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'MenuView' })

const router = useRouter()

const difficulty = ref<'easy' | 'medium' | 'hard'>('easy')
const seed = ref<string>('')

const size = computed(() => {
  switch (difficulty.value) {
    case 'medium':
      return { rows: 4, cols: 6 }
    case 'hard':
      return { rows: 6, cols: 6 }
    case 'easy':
    default:
      return { rows: 4, cols: 4 }
  }
})

function play() {
  router.push({
    path: '/game',
    query: {
      rows: String(size.value.rows),
      cols: String(size.value.cols),
      seed: seed.value || undefined,
    },
  })
}
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
}

.menu h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.menu-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 280px;
  margin-bottom: 1.25rem;
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.control-row label {
  font-size: 0.95rem;
  opacity: 0.9;
}

.control-row select,
.control-row input {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
  backdrop-filter: blur(6px);
}

.control-row select:focus,
.control-row input:focus {
  border-color: rgba(255, 255, 255, 0.5);
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.menu-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.menu-button span:first-child {
  font-size: 1.5rem;
}
</style>
