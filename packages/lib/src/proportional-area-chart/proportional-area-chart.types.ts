import { ComponentConfig, ComponentParams } from '../common/component.types';

export type ProportionalAreaChartParams = ComponentParams<
  ProportionalAreaChartData,
  ProportionalAreaChartConfig,
  ProportionalAreaChartStyle
>;

export type ProportionalAreaChartData = Array<ProportionalAreaChartDataItem>;

export interface ProportionalAreaChartDataItem {
  id: string;
  value: number;
}

export type ProportionalAreaChartConfig = ComponentConfig;

export interface ProportionalAreaChartStyle {
  fill: string;
  stroke: string;
  strokeWidth: string;
}
