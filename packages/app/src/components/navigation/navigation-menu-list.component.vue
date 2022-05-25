<template>
  <ul :class="baseClass">
    <router-link
      v-for="route in routes"
      :key="route.name"
      v-slot="{ href, navigate, isExactActive }"
      :to="{ name: route.name }"
      custom
    >
      <li :class="`${baseClass}__item`">
        <a :class="`${baseClass}__link`" :href="href" @click="navigate">
          {{ route.name }}
          <transition :name="`${baseClass}__active-item-mark--animated`">
            <div v-show="isExactActive" :class="`${baseClass}__active-item-mark`" />
          </transition>
        </a>
        <navigation-menu-list.component
          v-if="!!route.children?.length"
          :class="`${baseClass}__children-list`"
          :routes="route.children"
          :level="level + 1"
        />
      </li>
    </router-link>
  </ul>
</template>

<script setup lang="ts">
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

  const baseClass = 'navigation-menu-list';
</script>

<style lang="scss" scoped>
  .navigation-menu-list {
    padding: 0;
    margin: 0;
    list-style-type: none;

    &__link {
      position: relative;
      padding-left: 4px;
    }

    &__active-item-mark {
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
