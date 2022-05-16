import { ROUTES_CONSTS } from './routes.consts';
import { Route } from './routes.types';

const { names: NAMES } = ROUTES_CONSTS;

export const DOCS_ROUTES: Array<Route> = [
  {
    path: 'guide',
    name: NAMES.guide,
    component: () => import('../views/guide.view.vue'),
  },
];

export const ROUTES: Array<Route> = [
  {
    path: '/',
    name: NAMES.home,
    component: () => import('../views/home.view.vue'),
  },
  {
    path: '/docs',
    name: NAMES.docs,
    component: () => import('../views/docs.view.vue'),
    children: DOCS_ROUTES,
    redirect: DOCS_ROUTES[0],
  },
];
