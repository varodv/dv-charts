<template>
  <header>
    <h1>app</h1>
  </header>
  <router-view />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'App',
    setup: () => {
      return {};
    },
  });
</script>

<style lang="scss">
  #app {
  }
</style>
