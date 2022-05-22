<template>
  <header :class="baseClass">
    <div :class="`${baseClass}__main`">
      <router-link :class="`${baseClass}__link`" to="/">dv-charts</router-link>
    </div>
    <ul :class="`${baseClass}__navigation-bar`">
      <li v-for="{ name } in props.routes" :key="name" :class="`${baseClass}__navigation-item`">
        <router-link :class="`${baseClass}__link`" :active-class="`${baseClass}__link--active`" :to="{ name }">
          {{ name }}
        </router-link>
      </li>
    </ul>
  </header>
</template>

<script setup lang="ts">
  const props = defineProps({
    routes: {
      type: Array, // Array<Route>
      default: () => [],
    },
  });

  const baseClass = 'app-header';
</script>

<style lang="scss" scoped>
  .app-header {
    display: flex;
    align-items: center;

    &__navigation-bar {
      display: flex;
      padding: 0;
      margin: 0;
      list-style-type: none;
    }

    &__link {
      &--active {
        background-color: yellow;
      }
    }
  }
</style>
