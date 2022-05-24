<template>
  <ul :class="baseClass">
    <navigation-menu-item
      v-for="route in routes"
      :key="route.name"
      :class="`${baseClass}__item`"
      :route="route"
      :level="level"
    />
  </ul>
</template>

<script setup lang="ts">
  import NavigationMenuItem from './navigation-menu-item.component.vue';

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
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
</style>
