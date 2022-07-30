import { scaleLinear, scalePoint } from 'd3-scale';
import { EnterElement, select, Selection } from 'd3-selection';
import 'd3-transition';

import { Component } from '../common/component';
import { ComponentMouseHandlerTargetDetails, ComponentTransitionTimeFn, Size } from '../common/component.types';
import { style } from '../common/style';
import {
  ProportionalAreaChartConfig,
  ProportionalAreaChartData,
  ProportionalAreaChartDataItem,
  ProportionalAreaChartHandlers,
  ProportionalAreaChartParams,
  ProportionalAreaChartStyle,
} from './proportional-area-chart.types';

export class ProportionalAreaChart extends Component<
  ProportionalAreaChartData,
  ProportionalAreaChartConfig,
  ProportionalAreaChartStyle,
  ProportionalAreaChartHandlers
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

  public constructor(args: {
    element: HTMLElement;
    params?: ProportionalAreaChartParams;
    handlers?: ProportionalAreaChartHandlers;
  }) {
    super(args);

    this.element.classList.add(this.baseClass);
    const element = select(this.element) as Selection<HTMLElement, unknown, any, unknown>;
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

  public getDefaultConfig(): ProportionalAreaChartConfig {
    return {
      ...super.getDefaultConfig(),
      transitionsDelay: 0,
      minValue: 0,
      maxValue: 'max',
      minSize: 0,
    };
  }

  public getDefaultStyle(): ProportionalAreaChartStyle {
    const { colors } = style;
    return {
      fill: colors.primary,
      stroke: colors.background,
      strokeWidth: '1px',
      opacity: 1,
      cursor: 'auto',
    };
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
    const ids = this.data?.map(({ id }) => id) ?? [];
    this.scales.position.domain(ids);

    this.scales.size.domain([this.getMinValue(), this.getMaxValue()]);
  }

  private getMinValue(): number {
    let dataMinValue: number | undefined = undefined;
    if (!!this.data?.length) {
      dataMinValue = this.data.reduce((result, { value }) => Math.min(value, result), Infinity);
    }
    let minValue = dataMinValue;
    if (this.config.minValue !== 'min') {
      minValue = Math.min(this.config.minValue, minValue ?? Infinity);
    }
    return minValue ?? 0;
  }

  private getMaxValue(): number {
    let dataMaxValue: number | undefined = undefined;
    if (!!this.data?.length) {
      dataMaxValue = this.data.reduce((result, { value }) => Math.max(value, result), -Infinity);
    }
    let maxValue = dataMaxValue;
    if (this.config.maxValue !== 'max') {
      maxValue = Math.max(this.config.maxValue, maxValue ?? -Infinity);
    }
    return maxValue ?? 1;
  }

  private setScalesRange(): void {
    const { width, height } = this.size;
    const maxSize = Math.min(width, height);
    this.scales.position.range([maxSize / 2, width - maxSize / 2]);

    const minSize = Math.min(this.config.minSize, maxSize);
    this.scales.size.range([minSize, maxSize]);
  }

  private render(animate: boolean): void {
    const transitionsDelay = this.getTransitionTimeFn(animate ? this.config.transitionsDelay : 0);
    const transitionsDuration = this.getTransitionTimeFn(animate ? this.config.transitionsDuration : 0);
    const series = this.getSeries()
      .data(this.data ?? [], ({ id }) => id)
      .join(
        (enterSeries) => this.enterSeries(enterSeries, transitionsDelay, transitionsDuration),
        (updateSeries) => this.updateSeries(updateSeries, transitionsDelay, transitionsDuration),
        (exitSeries) => this.exitSeries(exitSeries, transitionsDelay, transitionsDuration),
      );

    this.sortSeries(series);
  }

  private getSeries(): Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined> {
    return this.selections.svg.selectAll(`.${this.baseClass}__serie`) as Selection<
      SVGGElement,
      ProportionalAreaChartDataItem,
      SVGSVGElement,
      undefined
    >;
  }

  private enterSeries(
    series: Selection<EnterElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
    transitionsDelay: ComponentTransitionTimeFn,
    transitionsDuration: ComponentTransitionTimeFn,
  ): Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined> {
    const enterSeries = series.append('g').attr('class', `${this.baseClass}__serie`);
    enterSeries
      .style('transform', this.getSerieTranslate3d.bind(this))
      .style('opacity', 0)
      .style('cursor', (dataItem) => this.getSerieStyle(dataItem).cursor)
      .transition()
      .delay(transitionsDelay)
      .duration(transitionsDuration)
      .style('opacity', (dataItem) => this.getSerieStyle(dataItem).opacity);

    enterSeries
      .append('circle')
      .attr('class', `${this.baseClass}__area`)
      .style('fill', (dataItem) => this.getSerieStyle(dataItem).fill)
      .style('stroke', (dataItem) => this.getSerieStyle(dataItem).stroke)
      .style('stroke-width', (dataItem) => this.getSerieStyle(dataItem).strokeWidth)
      .transition()
      .delay(transitionsDelay)
      .duration(transitionsDuration)
      .attr('r', this.getSerieCircleRadius.bind(this));

    this.updateSeriesContentHtml(enterSeries);

    if (!!this.handlers) {
      const handlers = this.handlers as ProportionalAreaChartHandlers;
      if (!!handlers.mouseenter) {
        enterSeries.on('mouseenter', (_event, dataItem) => {
          handlers.mouseenter?.({
            dataItem,
            targetDetails: this.getSerieHandlerTargetDetails(dataItem),
          });
          this.updateSeriesContentHtml(this.getSeries());
        });
      }
      if (!!handlers.mouseleave) {
        enterSeries.on('mouseleave', (_event, dataItem) => {
          handlers.mouseleave?.({
            dataItem,
            targetDetails: this.getSerieHandlerTargetDetails(dataItem),
          });
          this.updateSeriesContentHtml(this.getSeries());
        });
      }
      if (!!handlers.click) {
        enterSeries.on('click', (_event, dataItem) => {
          handlers.click?.({
            dataItem,
            targetDetails: this.getSerieHandlerTargetDetails(dataItem),
          });
          this.updateSeriesContentHtml(this.getSeries());
        });
      }
    }

    return enterSeries;
  }

  private getSerieTranslate3d(dataItem: ProportionalAreaChartDataItem): string {
    return `translate3d(${this.getSeriePositionX(dataItem)}px, ${this.getSeriePositionY()}px, 0)`;
  }

  private getSeriePositionX({ id }: ProportionalAreaChartDataItem): number {
    return this.scales.position(id) ?? 0;
  }

  private getSeriePositionY(): number {
    return this.size.height / 2;
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

  private updateSeriesContentHtml(
    series: Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
  ): void {
    series.each((dataItem, index, nodes) => {
      const contentHtml = this.config.contentHtml?.(dataItem, index);
      const serie = select(nodes[index]) as Selection<SVGGElement, ProportionalAreaChartDataItem, null, undefined>;
      let contentWrapper = serie.select(`.${this.baseClass}__serie-content-wrapper`) as Selection<
        SVGForeignObjectElement,
        ProportionalAreaChartDataItem,
        null,
        undefined
      >;
      if (!!contentHtml) {
        if (contentWrapper.empty()) {
          contentWrapper = serie
            .append('foreignObject')
            .attr('class', `${this.baseClass}__serie-content-wrapper`)
            .style('overflow', 'visible');
        }
        const contentSize = this.getSerieCircleRadius(dataItem) * 2;
        contentWrapper
          .attr('x', -contentSize / 2)
          .attr('y', -contentSize / 2)
          .attr('width', contentSize)
          .attr('height', contentSize)
          .html(contentHtml);
      } else {
        if (!contentWrapper.empty()) {
          contentWrapper.remove();
        }
      }
    });
  }

  private getSerieHandlerTargetDetails(dataItem: ProportionalAreaChartDataItem): ComponentMouseHandlerTargetDetails {
    const circleRadius = this.getSerieCircleRadius(dataItem);
    return {
      x: this.getSeriePositionX(dataItem) - circleRadius,
      y: this.getSeriePositionY() - circleRadius,
      width: circleRadius * 2,
      height: circleRadius * 2,
    };
  }

  private updateSeries(
    series: Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
    transitionsDelay: ComponentTransitionTimeFn,
    transitionsDuration: ComponentTransitionTimeFn,
  ): Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined> {
    series
      .style('cursor', (dataItem) => this.getSerieStyle(dataItem).cursor)
      .transition()
      .delay(transitionsDelay)
      .duration(transitionsDuration)
      .style('transform', this.getSerieTranslate3d.bind(this))
      .style('opacity', (dataItem) => this.getSerieStyle(dataItem).opacity);

    series
      .select(`.${this.baseClass}__area`)
      .transition()
      .delay(transitionsDelay)
      .duration(transitionsDuration)
      .attr('r', this.getSerieCircleRadius.bind(this))
      .style('fill', (dataItem) => this.getSerieStyle(dataItem).fill)
      .style('stroke', (dataItem) => this.getSerieStyle(dataItem).stroke)
      .style('stroke-width', (dataItem) => this.getSerieStyle(dataItem).strokeWidth);

    this.updateSeriesContentHtml(series);

    return series;
  }

  private exitSeries(
    series: Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>,
    transitionsDelay: ComponentTransitionTimeFn,
    transitionsDuration: ComponentTransitionTimeFn,
  ): void {
    series.transition().delay(transitionsDelay).duration(transitionsDuration).style('opacity', 0);
    series
      .transition()
      .delay((dataItem, index) => transitionsDelay(dataItem, index) + transitionsDuration(dataItem, index))
      .remove();
  }

  private sortSeries(series: Selection<SVGGElement, ProportionalAreaChartDataItem, SVGSVGElement, undefined>): void {
    series.sort(({ value: value1 }, { value: value2 }) => value1 - value2);
  }
}
