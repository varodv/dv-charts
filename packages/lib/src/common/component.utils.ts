import { BaseType, select, Selection } from 'd3-selection';

import { ComponentTransitionTimeFn, Position, Size } from './component.types';

export class ComponentUtils {
  public static getTransitionTimeFn<DatumType = any>(
    value: number | ComponentTransitionTimeFn<DatumType>,
  ): ComponentTransitionTimeFn<DatumType> {
    return typeof value === 'number' ? () => value as number : (value as ComponentTransitionTimeFn<DatumType>);
  }

  public static updateSeriesContentHtml<ElementType extends BaseType = Element, DatumType = any>({
    series,
    ...args
  }: {
    series: Selection<ElementType, DatumType, any, unknown>;
    contentHtml?: (dataItem: DatumType) => string;
    position?: (dataItem: DatumType) => Position;
    size?: (dataItem: DatumType) => Size;
    transitionsDelay?: ComponentTransitionTimeFn<DatumType>;
    transitionsDuration?: ComponentTransitionTimeFn<DatumType>;
  }): void {
    const contentHtmlFn = args.contentHtml ?? (() => undefined);
    const positionFn = args.position ?? (() => ({ x: 0, y: 0 }));
    const sizeFn = args.size ?? (() => ({ width: 0, height: 0 }));
    const transitionsDelayFn = args.transitionsDelay ?? (() => 0);
    const transitionsDurationFn = args.transitionsDuration ?? (() => 0);
    series.each((dataItem, index, nodes) => {
      const contentHtml = contentHtmlFn(dataItem);
      const serie = select(nodes[index]) as Selection<ElementType, DatumType, any, unknown>;
      let contentWrapper = serie.select('.dv-component-serie-content-wrapper') as Selection<
        SVGForeignObjectElement,
        DatumType,
        null,
        undefined
      >;
      if (!!contentHtml) {
        if (contentWrapper.empty()) {
          contentWrapper = serie
            .append('foreignObject')
            .attr('class', 'dv-component-serie-content-wrapper')
            .style('overflow', 'visible');
        }
        if (contentHtml !== contentWrapper.html()) {
          contentWrapper.html(contentHtml);
        }
        const { x, y } = positionFn(dataItem);
        const { width, height } = sizeFn(dataItem);
        contentWrapper
          .transition()
          .delay(transitionsDelayFn)
          .duration(transitionsDurationFn)
          .attr('x', x)
          .attr('y', y)
          .attr('width', width)
          .attr('height', height);
      } else {
        if (!contentWrapper.empty()) {
          contentWrapper.remove();
        }
      }
    });
  }

  public static updateSeriesHoverClasses<ElementType extends BaseType = Element, DatumType = any>(
    series: Selection<ElementType, DatumType, any, unknown>,
    isHoveredSerieFn?: (dataItem: DatumType) => boolean,
  ): void {
    series.classed('dv-hovered', (dataItem) => isHoveredSerieFn?.(dataItem) ?? false);
  }

  public static updateSeriesClickClasses<ElementType extends BaseType = Element, DatumType = any>(
    series: Selection<ElementType, DatumType, any, unknown>,
    isClickedSerieFn: (dataItem: DatumType) => boolean,
  ): void {
    series.each((dataItem, index, nodes) => {
      const serie = select(nodes[index]);
      const isClickedSerie = isClickedSerieFn(dataItem);
      serie
        .classed('dv-clicked', isClickedSerie || serie.classed('dv-clicked'))
        .classed('dv-clicked-toggle', () => {
          if (isClickedSerie) {
            return !serie.classed('dv-clicked-toggle');
          }
          return serie.classed('dv-clicked-toggle');
        })
        .classed('dv-clicked-first', () => {
          if (isClickedSerie) {
            return serie.classed('dv-clicked-first') || series.filter('.dv-clicked-first').empty();
          }
          return serie.classed('dv-clicked-first');
        })
        .classed('dv-clicked-first-toggle', () => {
          if (isClickedSerie) {
            return !serie.classed('dv-clicked-first-toggle') && series.filter('.dv-clicked-first-toggle').empty();
          }
          return serie.classed('dv-clicked-first-toggle');
        })
        .classed('dv-clicked-last', isClickedSerie)
        .classed('dv-clicked-last-toggle', isClickedSerie && !serie.classed('dv-clicked-last-toggle'));
    });
  }
}
