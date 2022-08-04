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
  import { ProportionalAreaChart, style } from 'dv-charts';
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  import AlphabetLogo from '../../assets/img/logos/alphabet.svg';
  import AmazonLogo from '../../assets/img/logos/amazon.svg';
  import AppleLogo from '../../assets/img/logos/apple.svg';
  import MetaLogo from '../../assets/img/logos/meta.svg';
  import MicrosoftLogo from '../../assets/img/logos/microsoft.svg';

  import { useI18n } from '../../stores';

  const { getMessage, locale } = useI18n();

  const baseClass = 'proportional-area-chart-example';

  const rawData = {
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
  const maxValue = Object.values(rawData).reduce((result, yearData) => {
    const yearMaxValue = yearData.reduce((partialResult, { revenue }) => {
      return Math.max(partialResult, revenue);
    }, 0);
    return Math.max(result, yearMaxValue);
  }, 0);

  const years = Object.keys(rawData).map(Number);
  const selectedYear = ref(years.at(-1));

  const componentEl = ref();
  let component: ProportionalAreaChart;

  const initialTransitionDelay = (_, index) => index * 100;
  const mouseTransitionsDuration = 200;

  const hoveredDataItemId = ref(undefined);

  const reloading = ref(false);

  const componentParams = computed(() => {
    const data = rawData[selectedYear.value].map(({ company, revenue }) => {
      return {
        id: company,
        value: revenue,
        style: getDataItemStyle(company),
      };
    });
    const config = {
      maxValue,
      contentHtml: getContentHtml,
    };
    return {
      data,
      config,
    };
  });

  const getDataItemStyle = (id: string) => {
    const { primary, background } = style.colors;
    return {
      ...(id !== hoveredDataItemId.value
        ? { fill: primary, stroke: background }
        : { fill: background, stroke: primary }),
      cursor: 'pointer',
    };
  };

  const getContentHtml = ({ id, value }): string => {
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
        <img class="${baseClass}__component-image" src="${logo}">
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
  };

  onMounted(() => {
    component = new ProportionalAreaChart({
      element: componentEl.value,
      params: {
        ...componentParams.value,
        config: {
          ...componentParams.value.config,
          transitionsDelay: initialTransitionDelay,
        },
      },
      handlers: {
        mouseenter: ({ dataItem: { id } }) => (hoveredDataItemId.value = id),
        mouseleave: () => (hoveredDataItemId.value = undefined),
      },
    });
  });

  onBeforeUnmount(() => component.destroy());

  watch(selectedYear, () => {
    const { transitionsDuration } = component.getDefaultConfig();
    component.update({
      ...componentParams.value,
      config: {
        ...componentParams.value.config,
        transitionsDuration,
        transitionsDelay: 0,
      },
    });
  });

  watch(hoveredDataItemId, () => {
    component.update({
      ...componentParams.value,
      config: {
        ...componentParams.value.config,
        transitionsDuration: mouseTransitionsDuration,
        transitionsDelay: 0,
      },
    });
  });

  watch(reloading, (value) => {
    const data = value ? [] : componentParams.value.data;
    const { transitionsDuration } = component.getDefaultConfig();
    const transitionsDelay = value ? 0 : initialTransitionDelay;
    component.update({
      data,
      config: {
        transitionsDuration,
        transitionsDelay,
      },
    });
    if (value) {
      setTimeout(() => {
        reloading.value = false;
      }, transitionsDuration);
    }
  });
</script>

<style lang="scss" scoped>
  .proportional-area-chart-example {
    &__component {
      height: 150px;
    }
  }
</style>
<style lang="scss">
  .proportional-area-chart-example {
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
      opacity: 0;
      transition: opacity calc(v-bind(mouseTransitionsDuration) * 1ms);

      &:hover {
        opacity: 1;
      }
    }

    &__component-text {
      text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
    }
  }
</style>
