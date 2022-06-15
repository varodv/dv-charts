import { BaseComponent } from '../common/base-component';
import {
  ProportionalAreaChartConfig,
  ProportionalAreaChartData,
  ProportionalAreaChartParams,
} from './proportional-area-chart.types';

import './proportional-area-chart.scss';

export class ProportionalAreaChart extends BaseComponent<ProportionalAreaChartData, ProportionalAreaChartConfig> {
  public static create(
    element: HTMLElement,
    params?: ProportionalAreaChartParams,
  ): BaseComponent<ProportionalAreaChartData, ProportionalAreaChartConfig> {
    return new ProportionalAreaChart(element, params);
  }
}
