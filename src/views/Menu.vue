<template>
  <div class="cs-page">
    <div class="cs-panel">
      <h1 class="cs-title-xxl">CS2 Memo</h1>

      <DifficultySelector />

      <div class="cs-col" style="width: 320px;">
        <label class="cs-label" for="seed">SEED</label>
        <input id="seed" type="text" v-model="seed" placeholder="np. cs2-2025" class="cs-input" />
      </div>

      <div class="cs-col" style="width: 320px;">
        <button class="cs-button primary" @click="play">
          <span class="button-accent"></span>
          <span>🎮</span>
          <span>Play</span>
        </button>
        <router-link to="/history" class="cs-button" style="justify-content:center;">
          <span class="button-accent"></span>
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
.cs-panel {
  gap: 1.6rem;
}

.cs-title-xxl {
  margin-bottom: 0.4rem;
}
</style>
