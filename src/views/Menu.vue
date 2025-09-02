<template>
  <div class="menu">
    <h1>CS2 Memo</h1>
    <div class="menu-buttons">
      <router-link to="/game" class="menu-button">
        <span>Play</span>
      </router-link>
      <router-link to="/history" class="menu-button">
        <span>History</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Menu
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
