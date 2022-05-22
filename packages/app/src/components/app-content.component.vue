<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :name="getTransitionName(route.meta.transitionDirection)"
      @beforeLeave="setAbsolute"
      @leaveCancelled="cleanUpTransitionStyles"
    >
      <component :is="Component" :class="baseClass" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
  const baseClass = 'app-content';

  const getTransitionName = (direction?: string): string => {
    let name = `${baseClass}--animated`;
    if (!!direction) {
      name += `-${direction}`;
    }
    return name;
  };

  const setAbsolute = (element: HTMLElement): void => {
    const { top, left, width, height } = element.getBoundingClientRect();
    element.style.setProperty('position', 'absolute');
    element.style.setProperty('top', `${top}px`);
    element.style.setProperty('left', `${left}px`);
    element.style.setProperty('width', `${width}px`);
    element.style.setProperty('height', `${height}px`);
  };
  const cleanUpTransitionStyles = (element: HTMLElement): void => {
    element.style.removeProperty('position');
    element.style.removeProperty('top');
    element.style.removeProperty('left');
    element.style.removeProperty('width');
    element.style.removeProperty('height');
  };
</script>

<style lang="scss" scoped>
  .app-content {
    &--animated,
    &--animated-right,
    &--animated-left {
      &-enter-active,
      &-leave-active {
        transition-property: transform, opacity;
      }

      &-enter-from,
      &-leave-to {
        opacity: 0;
      }
    }

    &--animated-right {
      &-enter-from {
        transform: translate3d(-100%, 0, 0);
      }
      &-leave-to {
        transform: translate3d(100%, 0, 0);
      }
    }

    &--animated-left {
      &-enter-from {
        transform: translate3d(100%, 0, 0);
      }
      &-leave-to {
        transform: translate3d(-100%, 0, 0);
      }
    }
  }
</style>
