<template>
  <app-header :routes="ROUTES" />
  <router-view />
</template>

<script setup lang="ts">
  import { AppHeader } from './components';
  import { ROUTES } from './router';
</script>

<style lang="scss">
  #app {
  }
</style>
