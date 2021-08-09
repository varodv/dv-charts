import { AbstractComponent } from '../shared/abstract.component';

import {
  ProportionalAreaChartConfig as Config,
  ProportionalAreaChartData as Data,
} from './proportional-area-chart.types';

export class ProportionalAreaChartComponent extends AbstractComponent<Data, Config> {
  protected resize(): void {
    return; // TODO: implement component
  }
}
