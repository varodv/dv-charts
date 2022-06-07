export interface I18nState {
  supportedLocales: Array<string>;
  messages: Messages;
}

export type Messages = Record<string, LocaleMessages>;

export type LocaleMessages = Record<string, any>;
