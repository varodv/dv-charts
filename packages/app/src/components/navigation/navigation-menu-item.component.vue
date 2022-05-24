<template>
  <div :class="`${baseClass}-wrapper`">
    <router-link v-slot="{ href, navigate, isExactActive }" :to="{ name: route.name }" custom>
      <li :class="baseClass">
        <a :class="`${baseClass}__link`" :href="href" @click="navigate">
          {{ route.name }}
          <transition :name="`${baseClass}__active-mark--animated`">
            <div v-show="isExactActive" :class="`${baseClass}__active-mark`" />
          </transition>
        </a>
        <navigation-menu
          v-if="!!route.children?.length"
          :class="`${baseClass}__children-menu`"
          :routes="route.children"
          :level="level + 1"
        />
      </li>
    </router-link>
  </div>
</template>

<script setup lang="ts">
  import NavigationMenu from './navigation-menu.component.vue';

  const props = defineProps({
    route: {
      type: Object, // Route
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
  });

  const baseClass = 'navigation-menu-item';
</script>

<style lang="scss" scoped>
  .navigation-menu-item {
    &__link {
      position: relative;
      padding-left: 3px;
    }

    &__active-mark {
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: 100%;
      background-color: black;

      &--animated {
        &-enter-active,
        &-leave-active {
          transition-property: top, height, opacity;
          transition-duration: 0.25s;
        }

        &-enter-active {
          transition-delay: 0.25s;
        }

        &-enter-from,
        &-leave-to {
          top: 50%;
          height: 0;
          opacity: 0;
        }
      }
    }
  }
</style>
