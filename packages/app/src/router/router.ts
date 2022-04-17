import { createRouter, createWebHistory } from 'vue-router';

import { Home } from '../views';

import { ROUTER_CONSTS } from './router.consts';

const { names: NAMES } = ROUTER_CONSTS;

export const ROUTER = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: NAMES.home,
      component: Home,
    },
    {
      path: '/:catchAll(.*)',
      redirect: { name: NAMES.home },
    },
  ],
});
