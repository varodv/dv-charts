import { AbstractComponent } from './abstract.component';

import { Config } from './models/config';

class TestComponent extends AbstractComponent<number[], Config> {
  protected resize(): void {
    return;
  }
}

describe('AbstractComponent', () => {
  const defaultConfig: Config = {
    animationsDurationInMillis: 400,
  };
  const config: Config = {
    animationsDurationInMillis: 800,
  };

  describe('constructor', () => {
    it('should create a component with the default config', () => {
      const component = new TestComponent();
      expect(component['config']).toEqual(defaultConfig);
    });

    it('should create a component with the passed config', () => {
      const component = new TestComponent(config);
      expect(component['config']).toEqual(config);
    });
  });
});
