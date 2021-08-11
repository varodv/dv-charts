import { AbstractComponent } from '../shared/abstract.component';

import { Params } from '../shared/models/params';

import {
  ProportionalAreaChartConfig as Config,
  ProportionalAreaChartData as Data,
  ProportionalAreaChartDataItem as DataItem,
} from './proportional-area-chart.types';

import { scaleLinear, scalePoint } from 'd3-scale';

export class ProportionalAreaChartComponent extends AbstractComponent<Data, Config> {
  private readonly scales = {
    position: scalePoint(),
    area: scaleLinear(),
  };

  public init(element: HTMLElement, params?: Params<Data, Config>): void {
    super.init(element, params);

    this.setScalesDomain();
    this.setScalesRange();
  }

  public update(params: Params<Data, Config>): void {
    super.update(params);

    this.setScalesDomain();
  }

  protected resize(): void {
    this.setScalesRange();
  }

  private setScalesDomain(): void {
    const ids = this.data?.map((dataItem: DataItem) => dataItem.id) || [];
    this.scales.position.domain(ids);

    const maxCount = this.data?.reduce((max: number, dataItem: DataItem) => Math.max(dataItem.count, max), 0) || 1;
    this.scales.area.domain([0, maxCount]);
  }

  private setScalesRange(): void {
    const size = this.size || { height: 0, width: 0 };
    const maxRadius = Math.min(size.height, size.width) / 2;

    this.scales.position.range([maxRadius, size.width - maxRadius]);

    const maxArea = Math.PI * Math.pow(maxRadius, 2);
    this.scales.area.range([0, maxArea]);
  }
}
