import { defineStore } from 'pinia';

import { I18nState } from './i18n.types';

export const useI18n = defineStore('i18n', {
  state: (): I18nState => ({
    supportedLocales: ['en'],
  }),
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
  },
});
