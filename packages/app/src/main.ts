import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { ROUTER } from './router';
import { useI18n } from './stores';

const app = createApp(App);

app.use(ROUTER);

app.use(createPinia());

const { locale, storeLocaleMessages } = useI18n();
const { default: messages } = await import(`./i18n/common/${locale}.js`);
storeLocaleMessages(messages);

app.mount('#app');
