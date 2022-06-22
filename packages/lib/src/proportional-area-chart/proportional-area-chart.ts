import { scaleLinear, scalePoint } from 'd3-scale';

import { BaseComponent } from '../common/base-component';
import { Size } from '../common/component.types';
import {
  ProportionalAreaChartConfig,
  ProportionalAreaChartData,
  ProportionalAreaChartParams,
} from './proportional-area-chart.types';

import './proportional-area-chart.scss';

export class ProportionalAreaChart extends BaseComponent<ProportionalAreaChartData, ProportionalAreaChartConfig> {
  private readonly scales = {
    position: scalePoint(),
    radius: scaleLinear(),
  };

  public constructor(...args: [HTMLElement, ProportionalAreaChartParams]) {
    super(...args);

    this.setScalesDomain();
    this.setScalesRange();
  }

  public update(params: ProportionalAreaChartParams): void {
    super.update(params);

    this.setScalesDomain();
  }

  protected resize(size: Size): void {
    super.resize(size);

    this.setScalesRange();
  }

  private setScalesDomain(): void {
    const dataIds = this.data?.map(({ id }) => id) ?? [];
    this.scales.position.domain(dataIds);

    let dataMinValue: number | undefined = undefined,
      dataMaxValue: number | undefined = undefined;
    if (!!this.data?.length) {
      ({ dataMinValue, dataMaxValue } = this.data.reduce(
        (result, { value }) => ({
          dataMinValue: Math.min(value, result.dataMinValue),
          dataMaxValue: Math.max(value, result.dataMaxValue),
        }),
        { dataMinValue: Infinity, dataMaxValue: -Infinity },
      ));
    }
    const minValue = dataMinValue !== undefined ? Math.min(dataMinValue, 0) : 0;
    const maxValue = dataMaxValue || 1;
    this.scales.radius.domain([minValue, maxValue]);
  }

  private setScalesRange(): void {
    const { width, height } = this.size;
    const maxRadius = Math.min(width, height) / 2;
    this.scales.position.range([maxRadius, width - maxRadius]);

    this.scales.radius.range([0, maxRadius]);
  }
}
