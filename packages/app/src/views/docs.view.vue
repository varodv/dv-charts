<template>
  <div :class="baseClass">
    <navigation-menu :class="`${baseClass}__navigation-menu`" :routes="DOCS_ROUTES" :level="1" />
    <router-view v-slot="{ Component }">
      <transition :name="`${baseClass}__content--animated`" mode="out-in">
        <component :is="Component" :class="`${baseClass}__content`" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
  import { NavigationMenu } from '../components';
  import { DOCS_ROUTES } from '../router';

  const baseClass = 'docs';
</script>

<style lang="scss" scoped>
  .docs {
    display: flex;

    &__navigation-menu {
      position: fixed;
      z-index: 10;
      top: 0;
      width: 250px;
      height: 100vh;
      padding-top: 30px;
      overflow: auto;
    }

    &__content {
      flex-grow: 1;
      padding-left: 250px;

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
