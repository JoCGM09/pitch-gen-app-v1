import { createRouter, createWebHistory } from 'vue-router';
import DeckView from '../views/DeckView.vue';
import AudienceView from '../views/AudienceView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/deck/0/-1'
    },
    {
      path: '/deck/:slide/:step',
      name: 'deck',
      component: DeckView
    },
    {
      path: '/join/:sessionId',
      name: 'join',
      component: AudienceView
    },
    {
      path: '/audiencia',
      name: 'audiencia',
      component: AudienceView
    }
  ]
});

export default router;
