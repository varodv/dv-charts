<template>
  <div ref="chartRef" class="chart" />
</template>

<script lang="ts">
  import { ProportionalAreaChartComponent } from 'dv-charts/dist/proportional-area-chart';

  import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

  export default defineComponent({
    name: 'App',
    setup: () => {
      const chartRef = ref();

      const animationsDurationInMillis = 1000;
      const chartComponent = new ProportionalAreaChartComponent({ animationsDurationInMillis });

      let interval: any;
      onMounted(() => {
        chartComponent.init(chartRef.value);
        interval = setInterval(() => {
          chartComponent.update({
            data: Array.from({ length: Math.floor(Math.random() * 101) }, (_, index: number) => ({
              id: index.toString(),
              count: Math.floor(Math.random() * 101),
            })),
          });
        }, animationsDurationInMillis);
      });
      onBeforeUnmount(() => {
        clearInterval(interval);
        chartComponent.destroy();
      });

      return {
        chartRef,
      };
    },
  });
</script>

<style lang="scss">
  html,
  body {
    height: 100%;
    margin: 0;
  }

  #app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }

  .chart {
    height: 100px;
  }
</style>
