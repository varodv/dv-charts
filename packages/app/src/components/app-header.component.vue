<template>
  <header :class="baseClass">
    <router-link
      v-for="{ name } in routes"
      :key="name"
      :class="[`${baseClass}__link`, `${baseClass}__link--route`]"
      :active-class="`${baseClass}__link--active`"
      :to="{ name }"
    >
      {{ name }}
    </router-link>
  </header>
</template>

<script setup lang="ts">
  import { Route } from '../router';

  const { routes } = defineProps({
    routes: {
      type: Array as () => Array<Route>,
      default: () => [],
    },
  });

  const baseClass = 'app-header';
</script>

<style lang="scss" scoped>
  .app-header {
    &__link {
      &--active {
        background-color: yellow;
      }
    }
  }
</style>
