import { scaleLinear, scalePoint } from 'd3-scale';
import { EnterElement, select, Selection } from 'd3-selection';
import 'd3-transition';

import { Component } from '../common/component';
import { Size } from '../common/component.types';
import { style } from '../common/style';
import {
  ProportionalAreaChartConfig,
  ProportionalAreaChartData,
  ProportionalAreaChartDataItem,
  ProportionalAreaChartParams,
  ProportionalAreaChartStyle,
} from './proportional-area-chart.types';

export class ProportionalAreaChart extends Component<
  ProportionalAreaChartData,
  ProportionalAreaChartConfig,
  ProportionalAreaChartStyle
> {
  private readonly baseClass = 'dv-proportional-area-chart';

  private readonly selections: {
    element: Selection<HTMLElement, unknown, any, unknown>;
    svg: Selection<SVGSVGElement, undefined, HTMLElement, unknown>;
  };

  private readonly scales = {
    position: scalePoint(),
    size: scaleLinear(),
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

  protected getDefaultConfig(): ProportionalAreaChartConfig {
    return {
      ...super.getDefaultConfig(),
      minSize: 0,
    };
  }

  protected getDefaultStyle(): ProportionalAreaChartStyle {
    const { colors } = style;
    return {
      fill: colors.primary,
      stroke: colors.background,
      strokeWidth: '1px',
      opacity: 1,
    };
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
    this.scales.size.domain([minValue, maxValue]);
  }

  private setScalesRange(): void {
    const { width, height } = this.size;
    const maxSize = Math.min(width, height);
    this.scales.position.range([maxSize / 2, width - maxSize / 2]);

    const minSize = Math.min(this.config.minSize, maxSize);
    this.scales.size.range([minSize, maxSize]);
  }

  private render(animate: boolean): void {
    const transitionsDuration = animate ? this.config.transitionsDuration : 0;
    const series = (
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

    this.sortSeries(series);
  }

  private enterSeries(
    series: Selection<EnterElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
    transitionsDuration: number,
  ): Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined> {
    const enterSeries = series.append('g').attr('class', `${this.baseClass}__serie`);
    enterSeries
      .style('transform', this.getSerieTranslate3d.bind(this))
      .style('opacity', 0)
      .transition()
      .duration(transitionsDuration)
      .style('opacity', (dataItem) => this.getSerieStyle(dataItem).opacity);

    enterSeries
      .append('circle')
      .attr('class', `${this.baseClass}__area`)
      .style('fill', (dataItem) => this.getSerieStyle(dataItem).fill)
      .style('stroke', (dataItem) => this.getSerieStyle(dataItem).stroke)
      .style('stroke-width', (dataItem) => this.getSerieStyle(dataItem).strokeWidth)
      .transition()
      .duration(transitionsDuration)
      .attr('r', this.getSerieCircleRadius.bind(this));

    return enterSeries;
  }

  private getSerieTranslate3d({ id }: ProportionalAreaChartDataItem): string {
    const positionX = this.scales.position(id) ?? 0;
    const positionY = this.size.height / 2;
    return `translate3d(${positionX}px, ${positionY}px, 0)`;
  }

  private getSerieStyle({ style }: ProportionalAreaChartDataItem): ProportionalAreaChartStyle {
    return {
      ...this.style,
      ...style,
    };
  }

  private getSerieCircleRadius({ value }: ProportionalAreaChartDataItem): number {
    return this.scales.size(value) / 2;
  }

  private updateSeries(
    series: Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
    transitionsDuration: number,
  ): Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined> {
    series
      .transition()
      .duration(transitionsDuration)
      .style('transform', this.getSerieTranslate3d.bind(this))
      .style('opacity', (dataItem) => this.getSerieStyle(dataItem).opacity);

    series
      .select(`.${this.baseClass}__area`)
      .transition()
      .duration(transitionsDuration)
      .attr('r', this.getSerieCircleRadius.bind(this))
      .style('fill', (dataItem) => this.getSerieStyle(dataItem).fill)
      .style('stroke', (dataItem) => this.getSerieStyle(dataItem).stroke)
      .style('stroke-width', (dataItem) => this.getSerieStyle(dataItem).strokeWidth);

    return series;
  }

  private exitSeries(
    series: Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
    transitionsDuration: number,
  ): void {
    series.transition().duration(transitionsDuration).style('opacity', 0);
    series.transition().delay(transitionsDuration).remove();
  }

  private sortSeries(series: Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>): void {
    series.sort(({ value: value1 }, { value: value2 }) => value1 - value2);
  }
}
