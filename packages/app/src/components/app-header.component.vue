<template>
  <header :class="baseClass">
    <h1>app</h1>
  </header>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AppHeader',
    setup: () => {
      const baseClass = 'app-header';
      return {
        baseClass,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .app-header {
  }
</style>
