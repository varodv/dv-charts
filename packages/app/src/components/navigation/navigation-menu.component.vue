<template>
  <nav :class="baseClass">
    <navigation-menu-list :class="`${baseClass}__list`" :routes="routes" :level="level" />
  </nav>
</template>

<script setup lang="ts">
  import NavigationMenuList from './navigation-menu-list.component.vue';

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

  const baseClass = 'navigation-menu';
</script>

<style lang="scss" scoped>
  .navigation-menu {
  }
</style>
