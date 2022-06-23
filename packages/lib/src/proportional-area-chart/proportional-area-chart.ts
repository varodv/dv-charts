import { scaleLinear, scalePoint } from 'd3-scale';
import { EnterElement, select, Selection } from 'd3-selection';
import 'd3-transition';

import { BaseComponent } from '../common/base-component';
import { Size } from '../common/component.types';
import {
  ProportionalAreaChartConfig,
  ProportionalAreaChartData,
  ProportionalAreaChartDataItem,
  ProportionalAreaChartParams,
} from './proportional-area-chart.types';

import './proportional-area-chart.scss';

export class ProportionalAreaChart extends BaseComponent<ProportionalAreaChartData, ProportionalAreaChartConfig> {
  private readonly baseClass = 'dv-proportional-area-chart';

  private readonly selections: {
    element: Selection<HTMLElement, unknown, any, unknown>;
    svg: Selection<SVGSVGElement, undefined, HTMLElement, unknown>;
  };

  private readonly scales = {
    position: scalePoint(),
    radius: scaleLinear(),
  };

  public constructor(...args: [HTMLElement, ProportionalAreaChartParams]) {
    super(...args);

    const element = select(this.element) as Selection<HTMLElement, unknown, any, unknown>;
    element.attr('class', this.baseClass);
    const svg = element.append('svg') as Selection<SVGSVGElement, undefined, HTMLElement, unknown>;
    svg.style('width', '100%').style('height', '100%');
    this.selections = {
      element,
      svg,
    };

    this.setScalesDomain();
    this.setScalesRange();

    this.render(true);
  }

  public update(params: ProportionalAreaChartParams): void {
    super.update(params);

    this.setScalesDomain();

    this.render(true);
  }

  protected resize(size: Size): void {
    super.resize(size);

    this.setScalesRange();

    this.render(false);
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

  private render(animate: boolean): void {
    const transitionsDuration = animate ? this.config.transitionsDuration : 0;
    (
      this.selections.svg.selectAll(`.${this.baseClass}__serie`) as Selection<
        SVGGElement,
        ProportionalAreaChartDataItem,
        SVGSVGElement,
        undefined
      >
    )
      .data(this.data ?? [], ({ id }) => id)
      .join(
        (enterSeries) => this.enterSeries(enterSeries, transitionsDuration),
        (updateSeries) => this.updateSeries(updateSeries, transitionsDuration),
        (exitSeries) => this.exitSeries(exitSeries, transitionsDuration),
      );
  }

  private enterSeries(
    series: Selection<EnterElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
    transitionsDuration: number,
  ): Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined> {
    const enterSeries = series.append('g').attr('class', `${this.baseClass}__serie`);
    enterSeries.style('opacity', 0).transition().duration(transitionsDuration).style('opacity', 1);

    enterSeries
      .append('circle')
      .attr('class', `${this.baseClass}__area`)
      .attr('cx', this.getSerieCirclePositionX.bind(this))
      .attr('cy', this.getSerieCirclePositionY())
      .transition()
      .duration(transitionsDuration)
      .attr('r', this.getSerieCircleRadius.bind(this));

    return enterSeries;
  }

  private getSerieCirclePositionX({ id }: ProportionalAreaChartDataItem): number {
    return this.scales.position(id) ?? 0;
  }

  private getSerieCirclePositionY(): number {
    return this.size.height / 2;
  }

  private getSerieCircleRadius({ value }: ProportionalAreaChartDataItem): number {
    return this.scales.radius(value);
  }

  private updateSeries(
    series: Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
    transitionsDuration: number,
  ): Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined> {
    series.transition().duration(transitionsDuration).style('opacity', 1);

    series
      .select(`.${this.baseClass}__area`)
      .transition()
      .duration(transitionsDuration)
      .attr('cx', this.getSerieCirclePositionX.bind(this))
      .attr('cy', this.getSerieCirclePositionY())
      .attr('r', this.getSerieCircleRadius.bind(this));

    return series;
  }

  private exitSeries(
    series: Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
    transitionsDuration: number,
  ): void {
    series.transition().duration(transitionsDuration).style('opacity', 0);
    series.transition().delay(transitionsDuration).remove();
  }
}
