import { init } from './';

describe('init', () => {
  it('should add dv-charts class to passed element', () => {
    const element = document.createElement('div');
    init(element);
    expect(element.classList.value).toContain('dv-charts');
  });
});
