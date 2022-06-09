import { useI18n } from '../stores';
import { ROUTES_CONSTS } from './routes.consts';
import { Route } from './routes.types';

const { names: NAMES } = ROUTES_CONSTS;

export const COMPONENTS_ROUTES: Array<Route> = [
  {
    path: 'proportional-area-chart',
    name: NAMES.proportionalAreaChart,
    component: () => import('../views/components/proportional-area-chart.view.vue'),
    meta: {
      label: () => useI18n().getMessage('common.routes.proportionalAreaChart'),
      messages: {
        en: () => import('../i18n/proportional-area-chart/en.js'),
      },
    },
  },
];

export const DOCS_ROUTES: Array<Route> = [
  {
    path: 'guide',
    name: NAMES.guide,
    component: () => import('../views/guide.view.vue'),
    meta: {
      label: () => useI18n().getMessage('common.routes.guide'),
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
    meta: {
      label: () => useI18n().getMessage('common.routes.components'),
    },
  },
];

export const ROUTES: Array<Route> = [
  {
    path: '/',
    name: NAMES.home,
    component: () => import('../views/home.view.vue'),
    meta: {
      label: () => useI18n().getMessage('common.routes.home'),
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
    meta: {
      label: () => useI18n().getMessage('common.routes.docs'),
    },
  },
];
