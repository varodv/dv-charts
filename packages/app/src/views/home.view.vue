<template>
  <main :class="baseClass">
    <h2>home</h2>
  </main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Home',
    setup: () => {
      const baseClass = 'home';
      return {
        baseClass,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .home {
  }
</style>
