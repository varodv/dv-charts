<template>
  <section :class="baseClass">
    <div ref="componentEl" :class="`${baseClass}__component`" />
    <p :class="`${baseClass}__legend`">
      {{ getMessage('proportionalAreaChart.example.legend') }}
      <select
        :class="`${baseClass}__select ${baseClass}__select--year`"
        :disabled="reloading"
        @change="selectedYear = Number($event.target.value)"
      >
        <option v-for="year in years" :key="year" :class="`${baseClass}__option`" :selected="year === selectedYear">
          {{ year }}
        </option>
      </select>
      -
      <a
        :class="`${baseClass}__link ${baseClass}__link--source`"
        href="https://www.visualcapitalist.com/how-big-tech-makes-their-billions-2022/"
        target="_blank"
      >
        {{ getMessage('proportionalAreaChart.example.source') }}
      </a>
      -
      <button
        :class="`${baseClass}__button ${baseClass}__button--reload`"
        :disabled="reloading"
        @click="reloading = true"
      >
        {{ getMessage('proportionalAreaChart.example.reload') }}
      </button>
    </p>
  </section>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import { useI18n } from '../../stores';

  const baseClass = 'example';

  const { getMessage } = useI18n();

  const data = {
    2020: [
      {
        company: 'Amazon',
        revenue: 386.1,
      },
      {
        company: 'Apple',
        revenue: 274.5,
      },
      {
        company: 'Alphabet',
        revenue: 182.5,
      },
      {
        company: 'Microsoft',
        revenue: 143.1,
      },
      {
        company: 'Meta',
        revenue: 86.0,
      },
    ],
    2021: [
      {
        company: 'Amazon',
        revenue: 469.8,
      },
      {
        company: 'Apple',
        revenue: 365.8,
      },
      {
        company: 'Alphabet',
        revenue: 257.6,
      },
      {
        company: 'Microsoft',
        revenue: 168.1,
      },
      {
        company: 'Meta',
        revenue: 117.9,
      },
    ],
  };

  const years = Object.keys(data).map(Number);
  const selectedYear = ref(years.at(-1));

  const reloading = ref(false);

  watch(reloading, (value) => {
    if (value) {
      setTimeout(() => {
        reloading.value = false;
      }, 500); // TODO: use component's transitions duration
    }
  });
</script>

<style lang="scss" scoped>
  .example {
    &__component {
      height: 150px;
    }
  }
</style>
