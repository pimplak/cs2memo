<template>
  <div class="history">
    <div class="history-header">
      <router-link to="/" class="back-button">
        <span>←</span>
        <span>Back</span>
      </router-link>
      <h1>Game History</h1>
    </div>

    <div class="history-content">
      <div class="panel">
        <GameHistoryList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'HistoryView' })
import GameHistoryList from '@/components/history/GameHistoryList.vue'
</script>

<style scoped>
.history {
  min-height: 100vh;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  color: white;
}

.history-header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-2px);
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
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
