<template>
  <div ref="el" :class="baseClass" />
</template>

<script setup lang="ts">
  import { style, Treemap } from 'dv-charts';
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
  const mouseTransitionsDuration = 200;

  const hoveredDataItemId = ref(undefined);

  const params = computed(() => {
    const data = Array.isArray(props.data) ? props.data.map(mapDataItem) : mapDataItem(props.data);
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

  const mapDataItem = (dataItem, parentStyle?) => {
    const style = getDataItemStyle(dataItem, parentStyle);
    const children = dataItem.children?.map((child) => mapDataItem(child, style));
    return {
      ...dataItem,
      ...(!!children && { children }),
      style,
    };
  };

  const getDataItemStyle = (dataItem, parentStyle?) => {
    return {
      fill: getDataItemFill(dataItem, parentStyle),
      ...(!parentStyle && { strokeWidth: '0' }),
      cursor: 'pointer',
    };
  };

  const getDataItemFill = ({ id }, parentStyle?): string => {
    const { primary, secondary } = style.colors;
    if (hoveredDataItemId.value === id) {
      return secondary;
    }
    return parentStyle?.fill ?? primary;
  };

  const getContentHtml = (dataItem): string => {
    const text = `${dataItem.id} (${getDataItemValue(dataItem).toLocaleString(locale)})`;
    return `<div class="${baseClass}__content" title="${text}">
      <span class="${baseClass}__content-text">
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
      handlers: {
        mouseenter: ({ dataItem: { id } }) => (hoveredDataItemId.value = id),
        mouseleave: () => (hoveredDataItemId.value = undefined),
      },
    });
  });

  onBeforeUnmount(() => component.destroy());

  watch(params, (value, oldValue) => {
    const { transitionsDuration } = component.getDefaultConfig();
    const transitionsDelay = Array.isArray(oldValue.data) && !oldValue.data.length ? initialTransitionDelay : 0;
    component.update({
      ...value,
      config: {
        ...value.config,
        transitionsDuration,
        transitionsDelay,
      },
    });
  });

  watch(hoveredDataItemId, () => {
    component.update({
      ...params.value,
      config: {
        ...params.value.config,
        transitionsDuration: mouseTransitionsDuration,
        transitionsDelay: 0,
      },
    });
  });
</script>

<style lang="scss">
  .treemap {
    &__content {
      display: flex;
      align-items: flex-start;
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
