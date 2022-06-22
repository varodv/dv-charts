import { scaleLinear, scalePoint } from 'd3-scale';
import { select, Selection } from 'd3-selection';

import { BaseComponent } from '../common/base-component';
import { Size } from '../common/component.types';
import {
  ProportionalAreaChartConfig,
  ProportionalAreaChartData,
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
    console.log('render', this.selections, animate); // TODO: implement method
  }
}
