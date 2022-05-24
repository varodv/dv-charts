<template>
  <ul :class="baseClass">
    <navigation-item
      v-for="route in routes"
      :key="route.name"
      :class="`${baseClass}__item`"
      :route="route"
      :level="level"
    />
  </ul>
</template>

<script setup lang="ts">
  import NavigationItem from './navigation-item.component.vue';

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

  const baseClass = 'navigation-list';
</script>

<style lang="scss" scoped>
  .navigation-list {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
</style>
