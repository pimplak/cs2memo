<template>
  <div class="cs-page">
    <div class="history-container">
      <div class="history-header">
        <router-link to="/" class="cs-button" style="gap:0.5rem;">
          <span class="button-accent"></span>
          <span>←</span>
          <span>Back</span>
        </router-link>
        <h1>Game History</h1>
      </div>

      <div class="history-content">
        <div class="panel cs-card">
          <GameHistoryList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'HistoryView' })
import GameHistoryList from '@/components/history/GameHistoryList.vue'
</script>

<style scoped>
.history-container {
  width: 100%;
}

.history-header {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.history-header h1 {
  margin-left: 2rem;
  font-size: 2rem;
}

.history-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.panel {
  padding: 2rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .history-header {
    padding: 1rem;
  }

  .history-header h1 {
    margin-left: 1rem;
    font-size: 1.5rem;
  }

  .history-content {
    padding: 1rem;
  }

  .panel {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .back-button span:last-child {
    display: none;
  }

  .history-header h1 {
    font-size: 1.2rem;
  }

  .tab-button {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
}
</style>
