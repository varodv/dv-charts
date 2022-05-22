import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router';

import { ROUTES } from './routes';
import { ROUTES_CONSTS } from './routes.consts';
import { TransitionDirectionEnum } from './routes.types';

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

ROUTER.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized): void => {
  let transitionDirection: TransitionDirectionEnum | undefined;
  const indexOfTo = ROUTES.findIndex(({ name }) => name === to.matched[0].name);
  const indexOfFrom = ROUTES.findIndex(({ name }) => name === from.matched[0]?.name);
  if (indexOfTo !== indexOfFrom && indexOfTo >= 0 && indexOfFrom >= 0) {
    if (indexOfTo - indexOfFrom > 0) {
      transitionDirection = TransitionDirectionEnum.LEFT;
    } else {
      transitionDirection = TransitionDirectionEnum.RIGHT;
    }
  } else {
    transitionDirection = undefined;
  }
  to.meta.transitionDirection = transitionDirection;
});
