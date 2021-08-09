import { ProportionalAreaChartComponent } from './proportional-area-chart.component';

describe('ProportionalAreaChartComponent', () => {
  describe('resize', () => {
    it('should not throw an error when component is not initialized yet', () => {
      const component = new ProportionalAreaChartComponent();
      expect(() => component['resize']()).not.toThrowError();
    });
  });
});
