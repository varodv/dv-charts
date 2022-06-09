import { RouteLocationNormalized } from 'vue-router';

import { useI18n } from '../stores';
import { ROUTES } from './routes';
import { RouteMessages, RouteTransitionDirectionEnum } from './routes.types';

export class RouterUtils {
  private static instance: RouterUtils;

  private storedMessageIds: Record<string, Array<string>>;

  private constructor() {
    this.storedMessageIds = {};
  }

  public static getInstance(): RouterUtils {
    if (!this.instance) {
      this.instance = new RouterUtils();
    }
    return this.instance;
  }

  public async loadMessages(route: RouteLocationNormalized): Promise<void> {
    const routeMessages = route.meta.messages as RouteMessages | undefined;
    const { locale, storeLocaleMessages } = useI18n();
    const routeName = String(route.name);
    if (!routeMessages?.[locale] || this.storedMessageIds[locale]?.includes(routeName)) {
      return;
    }
    const { default: messages } = await routeMessages[locale]();
    storeLocaleMessages(messages);
    if (!this.storedMessageIds.hasOwnProperty(locale)) {
      this.storedMessageIds[locale] = [];
    }
    this.storedMessageIds[locale].push(routeName);
  }

  public setTransitionDirection(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
    let transitionDirection: RouteTransitionDirectionEnum | undefined;
    const rootIndexOfFrom = ROUTES.findIndex(({ name }) => name === from.matched[0]?.name);
    const rootIndexOfTo = ROUTES.findIndex(({ name }) => name === to.matched[0]?.name);
    if (rootIndexOfFrom >= 0 && rootIndexOfTo >= 0 && rootIndexOfFrom !== rootIndexOfTo) {
      if (rootIndexOfTo > rootIndexOfFrom) {
        transitionDirection = RouteTransitionDirectionEnum.LEFT;
      } else {
        transitionDirection = RouteTransitionDirectionEnum.RIGHT;
      }
    } else {
      transitionDirection = undefined;
    }
    to.meta.transitionDirection = transitionDirection;
  }

  public setDocumentTitle(route: RouteLocationNormalized): void {
    const separator = ' | ';
    let title = document.title.split(separator).pop() ?? '';
    const routeLabelFn = route.meta.label as (() => string) | undefined;
    const routeLabel = routeLabelFn?.();
    if (!!routeLabel) {
      title = `${routeLabel}${separator}${title}`;
    }
    document.title = title;
  }
}

export const routerUtils = RouterUtils.getInstance();
