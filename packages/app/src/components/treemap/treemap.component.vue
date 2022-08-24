<template>
  <div ref="el" :class="baseClass" />
</template>

<script setup lang="ts">
  import { Treemap } from 'dv-charts';
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  import { useI18n } from '../../stores';

  const { locale } = useI18n();

  const props = defineProps({
    data: {
      type: [Array, Object], // TreemapData
      default: () => [],
    },
  });

  const baseClass = 'treemap';

  let component: Treemap;

  const el = ref();

  const initialTransitionDelay = (_, index) => index * 100;

  const params = computed(() => {
    const data = props.data.map((dataItem) => ({
      ...dataItem,
      style: {
        strokeWidth: '0',
      },
    }));
    const config = {
      padding: [30, 5, 5, 5],
      childrenMargin: 5,
      contentHtml: getContentHtml,
    };
    return {
      data,
      config,
    };
  });

  const getContentHtml = (dataItem): string => {
    const text = `${dataItem.id} (${getDataItemValue(dataItem).toLocaleString(locale)})`;
    return `<div class="${baseClass}__content">
      <span class="${baseClass}__content-text" title="${text}">
        ${text}
      </span>
    </div>`;
  };

  const getDataItemValue = (dataItem): number => {
    return (
      dataItem.value ?? dataItem.children.reduce((result, childDataItem) => result + getDataItemValue(childDataItem), 0)
    );
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
      width: 100%;
      height: 100%;
      padding: 5px;
    }

    &__content-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
