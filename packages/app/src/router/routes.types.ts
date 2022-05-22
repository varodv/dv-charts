import { RouteRecordRaw } from 'vue-router';

export enum TransitionDirectionEnum {
  RIGHT = 'right',
  LEFT = 'left',
}

export type Route = RouteRecordRaw & {
  name: string;
  meta?: {
    transitionDirection?: TransitionDirectionEnum;
  };
};
