<template>
  <div class="history">
    <div class="history-header">
      <router-link to="/" class="back-button">
        <span>←</span>
        <span>Back</span>
      </router-link>
      <h1>History</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
  // History
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 80px);
    padding: 2rem;
  }

  .history-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .history-placeholder span {
    font-size: 4rem;
  }

  .history-placeholder p {
    font-size: 1.2rem;
    opacity: 0.8;
  }
</style>
