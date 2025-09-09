<template>
  <div class="menu">
    <h1>CS2 Memo</h1>

    <div class="menu-content">
      <DifficultySelector />

      <div class="menu-controls">
        <div class="control-row">
          <label for="seed">Seed</label>
          <input id="seed" type="text" v-model="seed" placeholder="np. cs2-2025" />
        </div>
      </div>

      <div class="menu-buttons">
        <button class="menu-button primary" @click="play">
          <span>🎮</span>
          <span>Play</span>
        </button>
        <router-link to="/history" class="menu-button">
          <span>📊</span>
          <span>History</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameDifficultyStore } from '@/stores/gameDifficulty'
import DifficultySelector from '@/components/game/DifficultySelector.vue'

defineOptions({ name: 'MenuView' })

const router = useRouter()
const route = useRoute()
const difficultyStore = useGameDifficultyStore()

const seed = ref<string>('')

function play() {
  const queryParams: any = {}

  if (seed.value) {
    queryParams.seed = seed.value
  }

  if (route.query.rows && route.query.cols) {
    queryParams.rows = route.query.rows
    queryParams.cols = route.query.cols
  }

  router.push({
    path: '/game',
    query: Object.keys(queryParams).length > 0 ? queryParams : undefined
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
  padding: 2rem;
}

.menu h1 {
  font-size: 3rem;
  margin-bottom: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 800px;
  width: 100%;
}

.menu-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 300px;
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

.control-row input {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
  backdrop-filter: blur(6px);
  font-size: 1rem;
}

.control-row input:focus {
  border-color: rgba(255, 255, 255, 0.5);
}

.control-row input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
}

.menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
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
  cursor: pointer;
  font-family: inherit;
}

.menu-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.menu-button.primary {
  background: rgba(0, 170, 255, 0.2);
  border-color: rgba(0, 170, 255, 0.4);
}

.menu-button.primary:hover {
  background: rgba(0, 170, 255, 0.3);
  border-color: rgba(0, 170, 255, 0.6);
  box-shadow: 0 8px 25px rgba(0, 170, 255, 0.3);
}

.menu-button span:first-child {
  font-size: 1.3rem;
}

@media (max-width: 768px) {
  .menu {
    padding: 1rem;
  }

  .menu h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .menu-controls,
  .menu-buttons {
    width: 100%;
    max-width: 300px;
  }
}
</style>
