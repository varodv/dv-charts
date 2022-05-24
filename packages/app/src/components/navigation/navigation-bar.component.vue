<template>
  <transition-group
    ref="rootEl"
    tag="nav"
    :class="baseClass"
    :name="`${baseClass}__item--animated`"
    @beforeLeave="setAbsoluteStyles"
    @afterLeave="resetTransitionVariables()"
  >
    <div v-for="{ name } in currentRoute.matched" :key="name" :class="`${baseClass}__item`">
      <router-link :class="`${baseClass}__link`" :to="{ name }">
        {{ name }}
      </router-link>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';

  const baseClass = 'navigation-bar';

  const currentRoute = useRoute();

  const rootEl = ref();
  let leftOffset = 0;
  const setAbsoluteStyles = (element: HTMLElement): void => {
    const { left, width } = element.getBoundingClientRect();
    const { left: rootLeft } = rootEl.value.$el.getBoundingClientRect();
    element.style.setProperty('left', `${leftOffset + left - rootLeft}px`);
    leftOffset += width;
  };
  const resetTransitionVariables = (): void => {
    leftOffset = 0;
  };
</script>

<style lang="scss" scoped>
  .navigation-bar {
    display: flex;

    &__item {
      &:not(:first-child) {
        &:before {
          content: '>';
          margin: 0 4px;
        }
      }

      &--animated {
        &-enter-active,
        &-leave-active {
          transition-property: transform, opacity;
          transition-duration: 0.25s;
        }

        &-enter-active {
          transition-delay: 0.25s;
        }

        &-leave-active {
          position: absolute;
        }

        &-enter-from,
        &-leave-to {
          transform: translate3d(-4px, 0, 0);
          opacity: 0;
        }
      }
    }
  }
</style>
