import { hierarchy, HierarchyRectangularNode, treemap } from 'd3-hierarchy';
import { EnterElement, select, Selection } from 'd3-selection';

import { Component } from '../common/component';
import { ComponentTransitionTimeFn, Size } from '../common/component.types';
import { style } from '../common/style';
import {
  TreemapConfig,
  TreemapData,
  TreemapDataItem,
  TreemapDataLeafItem,
  TreemapDataParentItem,
  TreemapParams,
  TreemapStyle,
} from './types';

export class Treemap extends Component<TreemapData, TreemapConfig, TreemapStyle> {
  private readonly baseClass = 'dv-treemap';

  private readonly selections: {
    element: Selection<HTMLElement, unknown, any, unknown>;
    svg: Selection<SVGSVGElement, undefined, HTMLElement, unknown>;
  };

  private readonly rootNodeId = 'dv-root';

  public constructor(args: { element: HTMLElement; params?: TreemapParams }) {
    super(args);

    this.element.classList.add(this.baseClass);
    const element = select(this.element) as Selection<HTMLElement, unknown, any, unknown>;
    const svg = element.append('svg') as Selection<SVGSVGElement, undefined, HTMLElement, unknown>;
    svg.style('width', '100%').style('height', '100%').style('overflow', 'visible');
    this.selections = {
      element,
      svg,
    };

    this.render(true);
  }

  public getDefaultStyle(): TreemapStyle {
    return {
      fill: style.colors.primary,
    };
  }

  public update(params: TreemapParams): void {
    super.update(params);

    this.render(true);
  }

  protected resize(size: Size): void {
    super.resize(size);

    this.render(false);
  }

  private render(animate: boolean): void {
    const transitionsDuration = this.getTransitionTimeFn(animate ? this.config.transitionsDuration : 0);
    this.getSeries()
      .data(this.getNodes(), ({ data: { id } }) => id)
      .join(
        (enterSeries) => this.enterSeries(enterSeries, transitionsDuration),
        (updateSeries) => this.updateSeries(updateSeries, transitionsDuration),
        (exitSeries) => this.exitSeries(exitSeries, transitionsDuration),
      );
  }

  private getSeries(): Selection<SVGGElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined> {
    return this.selections.svg.selectAll(`.${this.baseClass}__serie`) as Selection<
      SVGGElement,
      HierarchyRectangularNode<TreemapDataItem>,
      SVGSVGElement,
      undefined
    >;
  }

  private getNodes(): Array<HierarchyRectangularNode<TreemapDataItem>> {
    if (!this.data) {
      return [];
    }
    const { width, height } = this.size;
    let data: TreemapDataParentItem;
    if (Array.isArray(this.data)) {
      data = {
        id: this.rootNodeId,
        children: this.data,
      };
    } else {
      data = this.data;
    }
    const root = hierarchy<TreemapDataItem>(data).sum((dataItem) => (dataItem as TreemapDataLeafItem).value ?? 0);
    return treemap<TreemapDataItem>().size([width, height]).padding(1)(root).descendants();
  }

  private enterSeries(
    series: Selection<EnterElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined>,
    transitionsDuration: ComponentTransitionTimeFn,
  ): Selection<SVGGElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined> {
    const enterSeries = series
      .filter(({ data: { id } }) => id !== this.rootNodeId)
      .append('g')
      .attr('class', `${this.baseClass}__serie`);
    enterSeries
      .style('transform', this.getSerieTranslate3d.bind(this))
      .style('opacity', 0)
      .transition()
      .duration(transitionsDuration)
      .style('opacity', 1);

    enterSeries
      .append('rect')
      .attr('class', `${this.baseClass}__area`)
      .attr('width', this.getSerieWidth.bind(this))
      .attr('height', this.getSerieHeight.bind(this))
      .style('fill', this.style.fill);

    return enterSeries;
  }

  private getSerieTranslate3d({ x0, y0 }: HierarchyRectangularNode<TreemapDataItem>): string {
    return `translate3d(${x0}px, ${y0}px, 0)`;
  }

  private getSerieWidth({ x0, x1 }: HierarchyRectangularNode<TreemapDataItem>): number {
    return x1 - x0;
  }

  private getSerieHeight({ y0, y1 }: HierarchyRectangularNode<TreemapDataItem>): number {
    return y1 - y0;
  }

  private updateSeries(
    series: Selection<SVGGElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined>,
    transitionsDuration: ComponentTransitionTimeFn,
  ): Selection<SVGGElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined> {
    series
      .transition()
      .duration(transitionsDuration)
      .style('transform', this.getSerieTranslate3d.bind(this))
      .style('opacity', 1);

    series
      .select(`.${this.baseClass}__area`)
      .transition()
      .duration(transitionsDuration)
      .attr('width', this.getSerieWidth.bind(this))
      .attr('height', this.getSerieHeight.bind(this));

    return series;
  }

  private exitSeries(
    series: Selection<SVGGElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined>,
    transitionsDuration: ComponentTransitionTimeFn,
  ): void {
    series.transition().duration(transitionsDuration).style('opacity', 0);
    series.transition().delay(transitionsDuration).remove();
  }
}

export * from './types';
