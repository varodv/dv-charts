import { RouteRecordRaw } from 'vue-router';

export type Route = RouteRecordRaw & {
  name: string;
  meta: RouteMeta;
};

export interface RouteMeta {
  label: () => string;
  messages?: {
    en: () => Promise<any>;
    [locale: string]: () => Promise<any>;
  };
  transitionDirection?: TransitionDirectionEnum;
}

export enum TransitionDirectionEnum {
  RIGHT = 'right',
  LEFT = 'left',
}
