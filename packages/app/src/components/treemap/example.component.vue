<template>
  <section :class="baseClass">
    <div ref="componentEl" :class="`${baseClass}__component`" />
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
  import { Treemap } from 'dv-charts';
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  import { useI18n } from '../../stores';

  const { getMessage, locale } = useI18n();

  const baseClass = 'treemap-example';

  const rawData = [
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
  ];

  const componentEl = ref();
  let component: Treemap;

  const initialTransitionDelay = (_, index) => index * 100;

  const reloading = ref(false);

  const componentParams = computed(() => {
    const data = rawData.map(({ company, revenue }) => {
      return {
        id: company,
        value: revenue,
      };
    });
    const config = {
      contentHtml: getContentHtml,
    };
    return {
      data,
      config,
    };
  });

  const getContentHtml = ({ id, value }): string => {
    const valueText = getMessage('treemap.example.value', {
      value: value.toLocaleString(locale),
    });
    return `<div class="${baseClass}__component-content">
      <span class="${baseClass}__component-text ${baseClass}__component-text--id">
        ${id}
      </span>
      <span class="${baseClass}__component-text ${baseClass}__component-text--value">
        ${valueText}
      </span>
    </div>`;
  };

  onMounted(() => {
    component = new Treemap({
      element: componentEl.value,
      params: {
        ...componentParams.value,
        config: {
          ...componentParams.value.config,
          transitionsDelay: initialTransitionDelay,
        },
      },
    });
  });

  onBeforeUnmount(() => component.destroy());

  watch(reloading, (value) => {
    const data = value ? [] : componentParams.value.data;
    const transitionsDelay = value ? 0 : initialTransitionDelay;
    component.update({
      data,
      config: {
        transitionsDelay,
      },
    });
    if (value) {
      const { transitionsDuration } = component.getDefaultConfig();
      setTimeout(() => {
        reloading.value = false;
      }, transitionsDuration * 2);
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
<style lang="scss">
  .treemap-example {
    &__component-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
  }
</style>
