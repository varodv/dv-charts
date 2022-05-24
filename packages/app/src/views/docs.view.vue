<template>
  <main :class="baseClass">
    <navigation-bar :class="`${baseClass}__navigation-bar`" />
    <navigation-menu :class="`${baseClass}__navigation-menu`" :routes="DOCS_ROUTES" :level="1" />
    <router-view v-slot="{ Component }">
      <transition :name="`${baseClass}__content--animated`" mode="out-in">
        <component :is="Component" :class="`${baseClass}__content`" />
      </transition>
    </router-view>
  </main>
</template>

<script setup lang="ts">
  import { NavigationBar, NavigationMenu } from '../components';
  import { DOCS_ROUTES } from '../router';

  const baseClass = 'docs';
</script>

<style lang="scss" scoped>
  .docs {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;

    &__navigation-menu {
      grid-row: 1 / 3;
    }

    &__content {
      flex-grow: 1;

      &--animated {
        &-enter-active,
        &-leave-active {
          transition: opacity 0.25s;
        }

        &-enter-from,
        &-leave-to {
          opacity: 0;
        }
      }
    }
  }
</style>
