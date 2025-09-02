import { createRouter, createWebHistory } from 'vue-router';
import Menu from '@/views/Menu.vue';
import Game from '@/views/Game.vue';
import History from '@/views/History.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'menu',
      component: Menu,
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
    },
    {
      path: '/history',
      name: 'history',
      component: History,
    },
  ],
});

export default router;
