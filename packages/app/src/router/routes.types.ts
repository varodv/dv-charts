import { RouteRecordRaw } from 'vue-router';

export type Route = RouteRecordRaw & {
  name: string;
  meta: RouteMeta;
};

export interface RouteMeta {
  label: () => string;
  messages?: RouteMessages;
  transitionDirection?: RouteTransitionDirectionEnum;
}

export interface RouteMessages extends Record<string, () => Promise<any>> {
  en: () => Promise<any>;
}

export enum RouteTransitionDirectionEnum {
  RIGHT = 'right',
  LEFT = 'left',
}
