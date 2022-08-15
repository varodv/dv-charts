import { ComponentConfig, ComponentParams } from '../common/component.types';

export type TreemapParams = ComponentParams<TreemapData, TreemapConfig, TreemapStyle>;

export type TreemapData = Array<TreemapDataItem> | TreemapDataParentItem;

export type TreemapDataItem = TreemapDataParentItem | TreemapDataLeafItem;

export interface TreemapDataBaseItem {
  id: string;
}

export interface TreemapDataParentItem extends TreemapDataBaseItem {
  children: Array<TreemapDataItem>;
}

export interface TreemapDataLeafItem extends TreemapDataBaseItem {
  value: number;
}

export type TreemapConfig = ComponentConfig<TreemapDataItem>;

export interface TreemapStyle {
  fill: string;
}
