import { createApp } from 'vue';

import App from './App.vue';

import { ROUTER } from './router';

const app = createApp(App);

app.use(ROUTER);

app.mount('#app');
