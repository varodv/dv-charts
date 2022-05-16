import { ROUTES_CONSTS } from './routes.consts';
import { Route } from './routes.types';

const { names: NAMES } = ROUTES_CONSTS;

export const ROUTES: Array<Route> = [
  {
    path: '/',
    name: NAMES.home,
    component: () => import('../views/home.view.vue'),
  },
];
