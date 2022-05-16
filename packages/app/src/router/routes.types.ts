import { RouteRecordRaw } from 'vue-router';

export type Route = RouteRecordRaw & {
  name: string;
};
