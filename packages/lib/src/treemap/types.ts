import { ComponentConfig, ComponentParams } from '../common/component.types';

export type TreemapParams = ComponentParams<TreemapData, TreemapConfig, TreemapStyle>;

export type TreemapData = Array<TreemapDataItem>;

export interface TreemapDataItem {
  id: string;
  value: number;
  children?: Array<TreemapDataItem>;
}

export type TreemapConfig = ComponentConfig<TreemapDataItem>;

export interface TreemapStyle {
  fill: string;
}
