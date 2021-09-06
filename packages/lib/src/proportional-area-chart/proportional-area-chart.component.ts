import { AbstractComponent } from '../shared/abstract.component';

import { Params } from '../shared/models/params';

import {
  ProportionalAreaChartConfig as Config,
  ProportionalAreaChartData as Data,
  ProportionalAreaChartDataItem as DataItem,
} from './proportional-area-chart.types';

import { scaleLinear, scalePoint } from 'd3-scale';
import { Selection } from 'd3-selection';
import 'd3-transition';

import './proportional-area-chart.styles.scss';

export class ProportionalAreaChartComponent extends AbstractComponent<Data, Config> {
  private static readonly BASE_CLASS = 'dv-proportional-area-chart';

  private readonly scales = {
    position: scalePoint(),
    area: scaleLinear(),
  };

  private svg?: Selection<SVGSVGElement, undefined, HTMLElement, undefined>;

  public init(element: HTMLElement, params?: Params<Data, Config>): void {
    super.init(element, params);

    this.setScalesDomain();
    this.setScalesRange();

    this.svg = this.element!.append('svg') as Selection<SVGSVGElement, undefined, HTMLElement, undefined>;
    this.svg.attr('class', `${ProportionalAreaChartComponent.BASE_CLASS}__svg`);

    this.render(true);
  }

  public update(params: Params<Data, Config>): void {
    super.update(params);

    this.setScalesDomain();

    this.render(true);
  }

  protected resize(): void {
    this.setScalesRange();

    this.render(false);
  }

  private setScalesDomain(): void {
    const ids = this.data?.map((dataItem: DataItem) => dataItem.id) ?? [];
    this.scales.position.domain(ids);

    const maxCount = this.data?.reduce((max: number, dataItem: DataItem) => Math.max(dataItem.count, max), 0) || 1;
    this.scales.area.domain([0, maxCount]);
  }

  private setScalesRange(): void {
    const size = this.size ?? { height: 0, width: 0 };
    const maxRadius = Math.min(size.height, size.width) / 2;

    this.scales.position.range([maxRadius, size.width - maxRadius]);

    const maxArea = Math.PI * Math.pow(maxRadius, 2);
    this.scales.area.range([0, maxArea]);
  }

  private render(animate: boolean): void {
    let series = (
      this.svg!.selectAll(`.${ProportionalAreaChartComponent.BASE_CLASS}__serie`) as Selection<
        SVGGElement,
        DataItem,
        SVGSVGElement,
        undefined
      >
    ).data(this.data ?? [], (dataItem: DataItem) => dataItem.id);
    const animationsDurationInMillis = animate ? this.config.animationsDurationInMillis : 0;
    this.removeSeries(series, animationsDurationInMillis);
    this.updateSeries(series, animationsDurationInMillis);
    this.enterSeries(series, animationsDurationInMillis);

    series = this.svg!.selectAll(`.${ProportionalAreaChartComponent.BASE_CLASS}__serie`);
    this.sortSeries(series);
  }

  private removeSeries(
    series: Selection<SVGGElement, DataItem, SVGSVGElement, undefined>,
    animationsDurationInMillis: number,
  ): void {
    const exitSeries = series.exit();
    exitSeries.transition().duration(animationsDurationInMillis).style('opacity', 0);
    exitSeries.transition().delay(animationsDurationInMillis).remove();
  }

  private updateSeries(
    series: Selection<SVGGElement, DataItem, SVGSVGElement, undefined>,
    animationsDurationInMillis: number,
  ): void {
    series.transition().duration(animationsDurationInMillis).style('opacity', 1);

    series
      .select(`.${ProportionalAreaChartComponent.BASE_CLASS}__circle`)
      .transition()
      .duration(animationsDurationInMillis)
      .attr('cx', (dataItem: DataItem) => this.getSerieCirclePositionX(dataItem))
      .attr('cy', this.getSerieCirclePositionY())
      .attr('r', (dataItem: DataItem) => this.getSerieCircleRadius(dataItem));
  }

  private getSerieCirclePositionX(dataItem: DataItem): number {
    return this.scales.position(dataItem.id) ?? 0;
  }

  private getSerieCirclePositionY(): number {
    return (this.size?.height ?? 0) / 2;
  }

  private getSerieCircleRadius(dataItem: DataItem): number {
    return Math.sqrt(this.scales.area(dataItem.count) / Math.PI);
  }

  private enterSeries(
    series: Selection<SVGGElement, DataItem, SVGSVGElement, undefined>,
    animationsDurationInMillis: number,
  ): void {
    const enterSeries = series.enter().append('g').attr('class', `${ProportionalAreaChartComponent.BASE_CLASS}__serie`);
    enterSeries.style('opacity', 0).transition().duration(animationsDurationInMillis).style('opacity', 1);

    enterSeries
      .append('circle')
      .attr('class', `${ProportionalAreaChartComponent.BASE_CLASS}__circle`)
      .attr('cx', (dataItem: DataItem): number => this.getSerieCirclePositionX(dataItem))
      .attr('cy', this.getSerieCirclePositionY())
      .transition()
      .duration(animationsDurationInMillis)
      .attr('r', (dataItem: DataItem) => this.getSerieCircleRadius(dataItem));
  }

  private sortSeries(series: Selection<SVGGElement, DataItem, SVGSVGElement, undefined>): void {
    series.sort((dataItem1: DataItem, dataItem2: DataItem) => dataItem2.count - dataItem1.count);
  }
}
