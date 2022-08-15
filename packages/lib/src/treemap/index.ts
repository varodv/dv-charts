import {
  hierarchy,
  HierarchyRectangularNode,
  treemap,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
  treemapSquarify,
} from 'd3-hierarchy';
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

  public getDefaultConfig(): TreemapConfig {
    return {
      ...super.getDefaultConfig(),
      transitionsDelay: 0,
      tile: 'squarify',
      padding: 1,
      childrenMargin: 1,
    };
  }

  public getDefaultStyle(): TreemapStyle {
    const { colors } = style;
    return {
      fill: colors.primary,
      stroke: colors.background,
      strokeWidth: '0px',
      opacity: 1,
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
    const transitionsDelay = this.getTransitionTimeFn(animate ? this.config.transitionsDelay : 0);
    const transitionsDuration = this.getTransitionTimeFn(animate ? this.config.transitionsDuration : 0);
    this.getSeries()
      .data(this.getNodes(), ({ data: { id } }) => id)
      .join(
        (enterSeries) => this.enterSeries(enterSeries, transitionsDelay, transitionsDuration),
        (updateSeries) => this.updateSeries(updateSeries, transitionsDelay, transitionsDuration),
        (exitSeries) => this.exitSeries(exitSeries, transitionsDelay, transitionsDuration),
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
    return treemap<TreemapDataItem>()
      .tile(this.getTile())
      .size([width, height])
      .paddingTop((node) => this.getPaddingFn()(node)[0])
      .paddingRight((node) => this.getPaddingFn()(node)[1])
      .paddingBottom((node) => this.getPaddingFn()(node)[2])
      .paddingLeft((node) => this.getPaddingFn()(node)[3])
      .paddingInner(this.getChildrenMarginFn().bind(this))(root)
      .descendants();
  }

  private getTile() {
    return {
      binary: () => treemapBinary,
      dice: () => treemapDice,
      slice: () => treemapSlice,
      sliceDice: () => treemapSliceDice,
      squarify: () => treemapSquarify,
      resquarify: () => treemapResquarify,
    }[this.config.tile]();
  }

  private getPaddingFn(): (node: HierarchyRectangularNode<TreemapDataItem>) => [number, number, number, number] {
    return ({ data: dataItem }) => {
      if (dataItem.id === this.rootNodeId) {
        return [0, 0, 0, 0];
      }
      let { padding } = this.config;
      if (typeof padding === 'function') {
        padding = padding(dataItem);
      }
      if (typeof padding === 'number') {
        padding = [padding, padding, padding, padding];
      }
      return padding;
    };
  }

  private getChildrenMarginFn(): (node: HierarchyRectangularNode<TreemapDataItem>) => number {
    return ({ data: dataItem }) => {
      let { childrenMargin } = this.config;
      if (typeof childrenMargin === 'function') {
        childrenMargin = childrenMargin(dataItem);
      }
      return childrenMargin;
    };
  }

  private enterSeries(
    series: Selection<EnterElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined>,
    transitionsDelay: ComponentTransitionTimeFn<TreemapDataItem>,
    transitionsDuration: ComponentTransitionTimeFn<TreemapDataItem>,
  ): Selection<SVGGElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined> {
    const enterSeries = series
      .filter(({ data: { id } }) => id !== this.rootNodeId)
      .append('g')
      .attr('class', `${this.baseClass}__serie`);
    enterSeries
      .style('transform', this.getSerieTranslate3d.bind(this))
      .style('opacity', 0)
      .transition()
      .delay(({ data: dataItem }, index) => transitionsDelay(dataItem, index))
      .duration(({ data: dataItem }, index) => transitionsDuration(dataItem, index))
      .style('opacity', ({ data: dataItem }) => this.getSerieStyle(dataItem).opacity);

    enterSeries
      .append('rect')
      .attr('class', `${this.baseClass}__area`)
      .attr('width', this.getSerieWidth.bind(this))
      .attr('height', this.getSerieHeight.bind(this))
      .style('fill', ({ data: dataItem }) => this.getSerieStyle(dataItem).fill)
      .style('stroke', ({ data: dataItem }) => this.getSerieStyle(dataItem).stroke)
      .style('stroke-width', ({ data: dataItem }) => this.getSerieStyle(dataItem).strokeWidth);

    return enterSeries;
  }

  private getSerieTranslate3d({ x0, y0 }: HierarchyRectangularNode<TreemapDataItem>): string {
    return `translate3d(${x0}px, ${y0}px, 0)`;
  }

  private getSerieStyle({ style }: TreemapDataItem): TreemapStyle {
    return {
      ...this.style,
      ...style,
    };
  }

  private getSerieWidth({ x0, x1 }: HierarchyRectangularNode<TreemapDataItem>): number {
    return x1 - x0;
  }

  private getSerieHeight({ y0, y1 }: HierarchyRectangularNode<TreemapDataItem>): number {
    return y1 - y0;
  }

  private updateSeries(
    series: Selection<SVGGElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined>,
    transitionsDelay: ComponentTransitionTimeFn<TreemapDataItem>,
    transitionsDuration: ComponentTransitionTimeFn<TreemapDataItem>,
  ): Selection<SVGGElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined> {
    series
      .transition()
      .delay(({ data: dataItem }, index) => transitionsDelay(dataItem, index))
      .duration(({ data: dataItem }, index) => transitionsDuration(dataItem, index))
      .style('transform', this.getSerieTranslate3d.bind(this))
      .style('opacity', ({ data: dataItem }) => this.getSerieStyle(dataItem).opacity);

    series
      .select(`.${this.baseClass}__area`)
      .transition()
      .delay(({ data: dataItem }, index) => transitionsDelay(dataItem, index))
      .duration(({ data: dataItem }, index) => transitionsDuration(dataItem, index))
      .attr('width', this.getSerieWidth.bind(this))
      .attr('height', this.getSerieHeight.bind(this))
      .style('fill', ({ data: dataItem }) => this.getSerieStyle(dataItem).fill)
      .style('stroke', ({ data: dataItem }) => this.getSerieStyle(dataItem).stroke)
      .style('stroke-width', ({ data: dataItem }) => this.getSerieStyle(dataItem).strokeWidth);

    return series;
  }

  private exitSeries(
    series: Selection<SVGGElement, HierarchyRectangularNode<TreemapDataItem>, SVGSVGElement, undefined>,
    transitionsDelay: ComponentTransitionTimeFn<TreemapDataItem>,
    transitionsDuration: ComponentTransitionTimeFn<TreemapDataItem>,
  ): void {
    series
      .transition()
      .delay(({ data: dataItem }, index) => transitionsDelay(dataItem, index))
      .duration(({ data: dataItem }, index) => transitionsDuration(dataItem, index))
      .style('opacity', 0);
    series
      .transition()
      .delay(({ data: dataItem }, index) => transitionsDelay(dataItem, index) + transitionsDuration(dataItem, index))
      .remove();
  }
}

export * from './types';
