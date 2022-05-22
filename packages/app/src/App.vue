<template>
  <app-header class="app-header" :routes="ROUTES" />
  <app-content class="app-content" />
</template>

<script setup lang="ts">
  import { AppContent, AppHeader } from './components';
  import { ROUTES } from './router';
</script>

<style lang="scss">
  html,
  body {
    overflow: hidden;
    padding: 0;
    margin: 0;
  }

  html,
  body,
  #app {
    height: 100%;
  }

  #app {
    display: flex;
    flex-direction: column;
    overflow: hidden scroll;
  }

  .app-header,
  .app-content {
    width: 100%;
    max-width: 1400px;
    margin: auto;
  }

  .app-header {
    position: sticky;
    top: 0;
  }

  .app-content {
    flex-grow: 1;
  }
</style>
