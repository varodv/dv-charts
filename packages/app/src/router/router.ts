import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router';

import { ROUTES } from './routes';
import { TransitionDirectionEnum } from './routes.types';

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

ROUTER.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized): void => {
  document.title = getDocumentTitle(to);

  to.meta.transitionDirection = getTransitionDirection(from, to);
});

const getDocumentTitle = (route: RouteLocationNormalized): string => {
  const separator = ' | ';
  let documentTitle = document.title.split(separator).pop() ?? '';
  const routeTitle = String(route.name);
  if (!!routeTitle) {
    documentTitle = `${routeTitle}${separator}${documentTitle}`;
  }
  return documentTitle;
};

const getTransitionDirection = (
  from: RouteLocationNormalized,
  to: RouteLocationNormalized,
): TransitionDirectionEnum | undefined => {
  let transitionDirection: TransitionDirectionEnum | undefined;
  const indexOfFrom = ROUTES.findIndex(({ name }) => name === from.matched[0]?.name);
  const indexOfTo = ROUTES.findIndex(({ name }) => name === to.matched[0]?.name);
  if (indexOfFrom !== indexOfTo && indexOfFrom >= 0 && indexOfTo >= 0) {
    if (indexOfTo - indexOfFrom > 0) {
      transitionDirection = TransitionDirectionEnum.LEFT;
    } else {
      transitionDirection = TransitionDirectionEnum.RIGHT;
    }
  } else {
    transitionDirection = undefined;
  }
  return transitionDirection;
};
