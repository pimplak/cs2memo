<template>
  <div class="game">
    <div class="game-header">
      <router-link to="/" class="back-button">
        <span>←</span>
        <span>Back</span>
      </router-link>
      <h1>Game</h1>
    </div>
    <div class="game-content">
      <div class="canvas-wrapper">
        <GameCanvas />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import GameCanvas from '@/components/game/GameCanvas.vue';

  defineOptions({
    name: 'GameView',
  });
</script>

<style scoped>
  .game {
    min-height: 100vh;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;
  }

  .game-header {
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

  .game-header h1 {
    margin-left: 2rem;
    font-size: 2rem;
  }

  .game-content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    min-height: calc(100vh - 80px);
    padding: 2rem;
  }

  .canvas-wrapper {
    width: 100%;
    height: calc(100vh - 120px);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    overflow: hidden;
  }
</style>
