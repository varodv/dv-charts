import { createRouter, createWebHistory } from 'vue-router';

import { routerUtils as RouterUtils } from './router.utils';
import { ROUTES } from './routes';

export const ROUTER = createRouter({
  history: createWebHistory(),
  routes: [
    ...ROUTES,
    {
      path: '/:catchAll(.*)',
      redirect: { path: '/' },
    },
  ],
});

ROUTER.beforeEach(async (to) => {
  await RouterUtils.loadMessages(to);
});

ROUTER.afterEach((to, from) => {
  RouterUtils.setTransitionDirection(to, from);
  RouterUtils.setDocumentTitle(to);
});
