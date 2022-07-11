import { ComponentConfig, ComponentMouseHandlerPayload, ComponentParams } from '../common/component.types';
import { RequireAtLeastOne } from '../common/require-at-least-one';

export type ProportionalAreaChartParams = ComponentParams<
  ProportionalAreaChartData,
  ProportionalAreaChartConfig,
  ProportionalAreaChartStyle
>;

export type ProportionalAreaChartData = Array<ProportionalAreaChartDataItem>;

export interface ProportionalAreaChartDataItem {
  id: string;
  value: number;
  style?: RequireAtLeastOne<ProportionalAreaChartStyle>;
}

export interface ProportionalAreaChartConfig extends ComponentConfig {
  minValue: number | 'min';
  maxValue: number | 'max';
  minSize: number;
}

export interface ProportionalAreaChartStyle {
  fill: string;
  stroke: string;
  strokeWidth: string;
  opacity: number;
}

export type ProportionalAreaChartHandlers = RequireAtLeastOne<{
  mouseenter: (payload: ProportionalAreaChartHandlerPayload) => void;
  mouseleave: (payload: ProportionalAreaChartHandlerPayload) => void;
  click: (payload: ProportionalAreaChartHandlerPayload) => void;
}>;

export interface ProportionalAreaChartHandlerPayload extends ComponentMouseHandlerPayload {
  dataItem: ProportionalAreaChartDataItem;
}
