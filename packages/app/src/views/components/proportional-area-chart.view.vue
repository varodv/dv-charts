<template>
  <main :class="baseClass">
    <h1 :class="`${baseClass}__title`">
      {{ title }}
    </h1>
    <div ref="componentEl" :class="`${baseClass}__component`" />
  </main>
</template>

<script setup lang="ts">
  import { ProportionalAreaChart } from 'dv-charts';
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  import { StringUtils } from '../../utils';

  const baseClass = 'proportional-area-chart';

  const route = useRoute();
  const title = StringUtils.capitalize(route.meta.label());

  const data = [
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

  const componentParams = computed(() => {
    const componentData = data.map(({ company, revenue }) => ({
      id: company,
      value: revenue,
    }));
    return {
      data: componentData,
    };
  });

  const componentEl = ref();
  let component: ProportionalAreaChart;
  onMounted(() => {
    component = new ProportionalAreaChart({
      element: componentEl.value,
      params: {
        ...componentParams.value,
        config: {
          ...componentParams.value.config,
          transitionsDelay: (_, index) => index * 100,
        },
      },
    });
  });
  onBeforeUnmount(() => component.destroy());
</script>

<style lang="scss" scoped>
  .proportional-area-chart {
    &__component {
      height: 160px;
    }
  }
</style>
