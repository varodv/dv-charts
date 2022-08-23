<template>
  <div ref="el" :class="baseClass" />
</template>

<script setup lang="ts">
  import { Treemap } from 'dv-charts';
  import { computed, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';

  const props = defineProps({
    data: {
      type: [Array, Object], // TreemapData
      default: () => [],
    },
  });
  const { data } = toRefs(props);

  const baseClass = 'treemap';

  let component: Treemap;

  const el = ref();

  const initialTransitionDelay = (_, index) => index * 100;

  const params = computed(() => {
    const config = {
      contentHtml: getContentHtml,
    };
    return {
      data: data.value,
      config,
    };
  });

  const getContentHtml = ({ id }): string => {
    return `<div class="${baseClass}__content">
      <span class="${baseClass}__content-text ${baseClass}__content-text--id" title="${id}">
        ${id}
      </span>
    </div>`;
  };

  onMounted(() => {
    component = new Treemap({
      element: el.value,
      params: {
        ...params.value,
        config: {
          ...params.value.config,
          transitionsDelay: initialTransitionDelay,
        },
      },
    });
  });

  onBeforeUnmount(() => component.destroy());

  watch(params, (value, oldValue) => {
    const transitionsDelay = Array.isArray(oldValue.data) && !oldValue.data.length ? initialTransitionDelay : 0;
    component.update({
      ...value,
      config: {
        ...value.config,
        transitionsDelay,
      },
    });
  });
</script>

<style lang="scss">
  .treemap {
    &__content {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    &__content-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
