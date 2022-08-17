<template>
  <main :class="baseClass">
    <h1 :class="`${baseClass}__title`">
      {{ title }}
    </h1>
    <example :class="`${baseClass}__example`" />
  </main>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';

  import { TreemapExample as Example } from '../../components';
  import { StringUtils } from '../../utils';

  const baseClass = 'treemap';

  const route = useRoute();

  const title = StringUtils.capitalize(route.meta.label());
</script>

<style lang="scss" scoped>
  .treemap {
  }
</style>
