import { defineStore } from 'pinia';

import { I18nState, LocaleMessages, Messages } from './i18n.types';

export const useI18n = defineStore('i18n', {
  state: (): I18nState => {
    const supportedLocales = ['en'];
    const messages = supportedLocales.reduce(
      (result: Messages, locale: string): Messages => ({
        ...result,
        [locale]: {},
      }),
      {},
    );
    return {
      supportedLocales,
      messages,
    };
  },
  getters: {
    locale({ supportedLocales }: I18nState): string {
      let locale = navigator.language;
      while (!!locale) {
        if (supportedLocales.includes(locale)) {
          return locale;
        }
        locale = locale.split('-').slice(0, -1).join('-');
      }
      return supportedLocales[0];
    },
    getMessage({ messages }: I18nState) {
      return (key: string, replace?: Record<string, string>): string => {
        const getValue = (object: Record<string, any>, keys: Array<string>): any => {
          const value = object[keys[0]];
          if (keys.length === 1) {
            return value;
          }
          if (typeof value === 'object') {
            return getValue(value, keys.slice(1));
          }
        };
        let message = getValue(messages[this.locale], key.split('.'));
        if (!message || typeof message !== 'string') {
          console.warn(`[useI18n().getMessage()] message not found ("${key}" in "${this.locale}")`);
          return key;
        }
        if (!!replace) {
          message = Object.entries(replace).reduce((result, [replaceKey, replaceValue]) => {
            return result.replace(`{${replaceKey}}`, replaceValue);
          }, message);
        }
        return message;
      };
    },
  },
  actions: {
    storeLocaleMessages(messages: LocaleMessages, locale?: string): void {
      if (!!locale && !this.supportedLocales.includes(locale)) {
        console.error(`[useI18n().storeLocaleMessages()] locale not supported ("${locale}")`);
        return;
      }
      Object.assign(this.messages[locale ?? this.locale], messages);
    },
  },
});
