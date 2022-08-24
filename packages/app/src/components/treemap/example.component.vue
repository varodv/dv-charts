<template>
  <section :class="baseClass">
    <treemap :class="`${baseClass}__component`" :data="!reloading ? data : []" />
    <p :class="`${baseClass}__legend`">
      {{ getMessage('treemap.example.legend') }}
      -
      <a
        :class="`${baseClass}__link ${baseClass}__link--source`"
        href="https://www.visualcapitalist.com/how-big-tech-makes-their-billions-2022/"
        target="_blank"
      >
        {{ getMessage('treemap.example.source') }}
      </a>
      -
      <button
        :class="`${baseClass}__button ${baseClass}__button--reload`"
        :disabled="reloading"
        @click="reloading = true"
      >
        {{ getMessage('treemap.example.reload') }}
      </button>
    </p>
  </section>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import rawData from '../../assets/data/gamam-revenue-2021.json';

  import { useI18n } from '../../stores';
  import Treemap from './treemap.component.vue';

  const { getMessage } = useI18n();

  const baseClass = 'treemap-example';

  const data = rawData.map(({ company, revenue, breakdown }) => {
    return {
      id: company,
      children: breakdown.map(({ product, percentage }) => ({
        id: product,
        value: revenue * (percentage / 100),
      })),
    };
  });

  const reloading = ref(false);

  watch(reloading, (value) => {
    if (value) {
      setTimeout(() => {
        reloading.value = false;
      }, 1000);
    }
  });
</script>

<style lang="scss" scoped>
  .treemap-example {
    &__component {
      height: 400px;
    }
  }
</style>
