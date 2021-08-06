import { Config } from '../shared/models/config';

export type ProportionalAreaChartData = ProportionalAreaChartDataItem[];

export interface ProportionalAreaChartDataItem {
  id: string;
  count: number;
}

export type ProportionalAreaChartConfig = Config;
