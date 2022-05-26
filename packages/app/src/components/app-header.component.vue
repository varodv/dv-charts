<template>
  <header :class="baseClass">
    <div :class="`${baseClass}__main`">
      <router-link :class="`${baseClass}__link`" to="/">dv-charts</router-link>
    </div>
    <nav ref="navigationBarEl" :class="`${baseClass}__navigation-bar`">
      <ul :class="`${baseClass}__navigation-items-list`">
        <li v-for="{ name } in routes" :key="name" :data-id="name" :class="`${baseClass}__navigation-item`">
          <router-link :class="`${baseClass}__link`" :to="{ name }">
            {{ name }}
          </router-link>
        </li>
      </ul>
      <transition :name="`${baseClass}__navigation-item-active-mark--animated`">
        <div
          v-show="!!activeRouteName"
          ref="navigationItemActiveMarkEl"
          :class="`${baseClass}__navigation-item-active-mark`"
        />
      </transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';

  const props = defineProps({
    routes: {
      type: Array, // Array<Route>
      default: () => [],
    },
    activeRouteName: {
      type: String,
      default: undefined,
    },
  });

  const baseClass = 'app-header';

  const navigationBarEl = ref();
  const navigationItemActiveMarkEl = ref();
  const setNavigationItemActiveMarkStyles = (activeRouteName: string): void => {
    const navigationItemEl = !!activeRouteName
      ? navigationBarEl.value.querySelector(`.${baseClass}__navigation-item[data-id=${activeRouteName}]`)
      : undefined;
    if (!navigationItemEl) {
      return;
    }
    const { left: navigationItemLeft, width } = navigationItemEl.getBoundingClientRect();
    const { left: navigationBarLeft } = navigationBarEl.value.getBoundingClientRect();
    const left = navigationItemLeft - navigationBarLeft;
    navigationItemActiveMarkEl.value.style.setProperty('left', `${left}px`);
    navigationItemActiveMarkEl.value.style.setProperty('width', `${width}px`);
  };

  onMounted(() => watch(() => props.activeRouteName, setNavigationItemActiveMarkStyles, { immediate: true }));
</script>

<style lang="scss" scoped>
  .app-header {
    display: flex;
    align-items: center;

    &__main {
      width: 250px;
    }

    &__navigation-bar {
      position: relative;
    }

    &__navigation-items-list {
      display: flex;
      padding: 0;
      margin: 0;
      list-style-type: none;
    }

    &__navigation-item-active-mark {
      position: absolute;
      bottom: -1px;
      height: 1px;
      background-color: black;
      transition-property: left, width, opacity;
      transition-duration: 0.5s;

      &--animated {
        &-enter-from,
        &-leave-to {
          opacity: 0;
        }
      }
    }
  }
</style>
