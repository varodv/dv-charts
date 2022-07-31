<template>
  <main :class="baseClass">
    <h1 :class="`${baseClass}__title`">
      {{ title }}
    </h1>
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
  </main>
</template>

<script setup lang="ts">
  import { ProportionalAreaChart } from 'dv-charts';
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  import AlphabetLogo from '../../assets/img/logos/alphabet.svg';
  import AmazonLogo from '../../assets/img/logos/amazon.svg';
  import AppleLogo from '../../assets/img/logos/apple.svg';
  import MetaLogo from '../../assets/img/logos/meta.svg';
  import MicrosoftLogo from '../../assets/img/logos/microsoft.svg';

  import { useI18n } from '../../stores';
  import { StringUtils } from '../../utils';

  const { getMessage, locale } = useI18n();

  const baseClass = 'proportional-area-chart';

  const route = useRoute();
  const title = StringUtils.capitalize(route.meta.label());

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
  const dataMaxValue = Object.values(data).reduce((result, yearData) => {
    const yearDataMaxValue = yearData.reduce((partialResult, { revenue }) => {
      return Math.max(partialResult, revenue);
    }, 0);
    return Math.max(result, yearDataMaxValue);
  }, 0);

  const years = Object.keys(data).map(Number);
  const selectedYear = ref(Number(years.at(-1)));

  const reloading = ref(false);

  const componentParams = computed(() => {
    const componentData = data[selectedYear.value].map(({ company, revenue }) => ({
      id: company,
      value: revenue,
    }));
    return {
      data: componentData,
      config: {
        maxValue: dataMaxValue,
        contentHtml: ({ id, value }): string => {
          const logo = {
            Alphabet: () => AlphabetLogo,
            Amazon: () => AmazonLogo,
            Apple: () => AppleLogo,
            Meta: () => MetaLogo,
            Microsoft: () => MicrosoftLogo,
          }[id]?.();
          const valueText = getMessage('proportionalAreaChart.example.value', {
            value: value.toLocaleString(locale),
          });
          return `<div class="${baseClass}__component-content">
            <figure class="${baseClass}__component-figure">
              <img class="${baseClass}__component-image" src="${logo}" >
            </figure>
            <div class="${baseClass}__component-text-container">
              <span class="${baseClass}__component-text ${baseClass}__component-text--id">
                ${id}
              </span>
              <span class="${baseClass}__component-text ${baseClass}__component-text--value">
                ${valueText}
              </span>
            </div>
          </div>`;
        },
      },
    };
  });

  const componentEl = ref();
  const componentInitialTransitionDelay = (_, index) => index * 100;
  let component: ProportionalAreaChart;
  onMounted(() => {
    component = new ProportionalAreaChart({
      element: componentEl.value,
      params: {
        ...componentParams.value,
        config: {
          ...componentParams.value.config,
          transitionsDelay: componentInitialTransitionDelay,
        },
      },
    });
  });
  onBeforeUnmount(() => component.destroy());

  watch(componentParams, (value) => {
    component.update({
      ...value,
      config: {
        ...value,
        transitionsDelay: 0,
      },
    });
  });
  watch(reloading, (value) => {
    const componentData = value ? [] : componentParams.value.data;
    const transitionsDelay = value ? 0 : componentInitialTransitionDelay;
    component.update({
      data: componentData,
      config: {
        transitionsDelay,
      },
    });
    if (value) {
      setTimeout(() => {
        reloading.value = false;
      }, component.getDefaultConfig().transitionsDuration);
    }
  });
</script>

<style lang="scss" scoped>
  .proportional-area-chart {
    &__component {
      height: 150px;
    }
  }
</style>
<style lang="scss">
  .proportional-area-chart {
    &__component-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    &__component-figure {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      height: 50%;
      max-height: 50px;
      margin: 0;
    }

    &__component-image {
      max-width: 100%;
      max-height: 100%;
      filter: brightness(0) invert(1);
    }

    &__component-text-container {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgba(white, 0.75);
      opacity: 0;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
