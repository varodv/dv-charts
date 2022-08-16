import { BaseType, select, Selection } from 'd3-selection';

import { ComponentTransitionTimeFn } from './component.types';

export class ComponentUtils {
  public static getTransitionTimeFn<DatumType = any>(
    value: number | ComponentTransitionTimeFn<DatumType>,
  ): ComponentTransitionTimeFn<DatumType> {
    return typeof value === 'number' ? () => value as number : (value as ComponentTransitionTimeFn<DatumType>);
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
