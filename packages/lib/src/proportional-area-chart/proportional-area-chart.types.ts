export type ProportionalAreaChartData = ProportionalAreaChartDataItem[];

export interface ProportionalAreaChartDataItem {
  id: string;
  count: number;
}

export interface ProportionalAreaChartConfig {
  animationsDurationInMillis: number;
}
