import { createRouter, createWebHistory } from 'vue-router';

import { ROUTES } from './routes';
import { ROUTES_CONSTS } from './routes.consts';

const { names: NAMES } = ROUTES_CONSTS;

export const ROUTER = createRouter({
  history: createWebHistory(),
  routes: [
    ...ROUTES,
    {
      path: '/:catchAll(.*)',
      redirect: { name: NAMES.home },
    },
  ],
});
