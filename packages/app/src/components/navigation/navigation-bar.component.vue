<template>
  <nav :class="baseClass">
    <navigation-list :class="`${baseClass}__list`" :routes="routes" :level="level" />
  </nav>
</template>

<script setup lang="ts">
  import NavigationList from './navigation-list.component.vue';

  const props = defineProps({
    routes: {
      type: Array, // Array<Route>
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
  });

  const baseClass = 'navigation-bar';
</script>

<style lang="scss" scoped>
  .navigation-bar {
  }
</style>
