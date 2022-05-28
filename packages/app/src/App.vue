<template>
  <app-header class="app-header" :routes="ROUTES" :active-route-name="activeRouteName" />
  <app-content class="app-content" />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  import { AppContent, AppHeader } from './components';
  import { ROUTES } from './router';

  const activeRouteName = computed(() => useRoute().matched[0]?.name);
</script>

<style lang="scss">
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    padding: 0;
    margin: 0;
  }

  html {
    overflow: hidden scroll;
  }

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .app-header,
  .app-content {
    width: 100%;
    max-width: 1400px;
  }

  .app-header {
    position: fixed;
    z-index: 100;
    top: 0;
    height: 30px;
  }

  .app-content {
    min-height: 100vh;
    padding-top: 30px;
  }
</style>
