<template>
  <app-header />
  <router-view />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { AppHeader } from './components';

  export default defineComponent({
    name: 'App',
    components: {
      AppHeader,
    },
    setup: () => {
      return {};
    },
  });
</script>

<style lang="scss">
  #app {
  }
</style>
