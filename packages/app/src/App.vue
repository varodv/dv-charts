<template>
  <div class="app-charts" ref="charts"></div>
</template>

<script lang="ts">
  import { init } from 'dv-charts';

  import { defineComponent, onMounted, ref } from 'vue';

  export default defineComponent({
    name: 'App',
    setup: () => {
      const charts = ref();

      onMounted(() => {
        init(charts.value);
      });

      return {
        charts,
      };
    },
  });
</script>

<style lang="scss">
  .app-charts {
    height: 100px;
  }
</style>
