import { ROUTES_CONSTS } from './routes.consts';
import { Route } from './routes.types';

const { names: NAMES } = ROUTES_CONSTS;

export const COMPONENTS_ROUTES: Array<Route> = [];

export const DOCS_ROUTES: Array<Route> = [
  {
    path: 'guide',
    name: NAMES.guide,
    component: () => import('../views/guide.view.vue'),
    meta: {
      messages: {
        en: () => import('../i18n/guide/en.js'),
      },
    },
  },
  {
    path: 'components',
    name: NAMES.components,
    component: () => import('../views/components.view.vue'),
    children: COMPONENTS_ROUTES,
    redirect: COMPONENTS_ROUTES[0],
  },
];

export const ROUTES: Array<Route> = [
  {
    path: '/',
    name: NAMES.home,
    component: () => import('../views/home.view.vue'),
    meta: {
      messages: {
        en: () => import('../i18n/home/en.js'),
      },
    },
  },
  {
    path: '/docs',
    name: NAMES.docs,
    component: () => import('../views/docs.view.vue'),
    children: DOCS_ROUTES,
    redirect: DOCS_ROUTES[0],
  },
];
