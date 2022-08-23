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

  import { useI18n } from '../../stores';
  import Treemap from './treemap.component.vue';

  const { getMessage } = useI18n();

  const baseClass = 'treemap-example';

  const data = [
    {
      id: 'Amazon',
      value: 469.8,
    },
    {
      id: 'Apple',
      value: 365.8,
    },
    {
      id: 'Alphabet',
      value: 257.6,
    },
    {
      id: 'Microsoft',
      value: 168.1,
    },
    {
      id: 'Meta',
      value: 117.9,
    },
  ];

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
