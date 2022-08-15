import { ComponentConfig, ComponentParams } from '../common/component.types';
import { RequireAtLeastOne } from '../common/require-at-least-one';

export type TreemapParams = ComponentParams<TreemapData, TreemapConfig, TreemapStyle>;

export type TreemapData = Array<TreemapDataItem> | TreemapDataParentItem;

export type TreemapDataItem = TreemapDataParentItem | TreemapDataLeafItem;

export interface TreemapDataBaseItem {
  id: string;
  style?: RequireAtLeastOne<TreemapStyle>;
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
  opacity: number;
}
