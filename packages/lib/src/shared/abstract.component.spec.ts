import { AbstractComponent } from './abstract.component';

import { Config } from './models/config';

class TestComponent extends AbstractComponent<number[], Config> {
  protected resize(): void {
    return;
  }
}

describe('AbstractComponent', () => {
  const data = [5, 7];
  const defaultConfig: Config = {
    animationsDurationInMillis: 400,
  };
  const config: Config = {
    animationsDurationInMillis: 800,
  };

  const resizeObserverObserveMock = jest.fn();
  const resizeObserverDisconnectMock = jest.fn();
  beforeAll(() => {
    (window as any).ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: resizeObserverObserveMock,
      disconnect: resizeObserverDisconnectMock,
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  describe('init', () => {
    it('should initialize the component into the passed element', () => {
      const component = new TestComponent();
      const element = document.createElement('div');
      component.init(element);
      expect(component['element']!.node()).toEqual(element);
      expect(component['data']).toBeUndefined();
      expect(component['config']).toEqual(defaultConfig);
      expect(component['size']).toEqual({ height: 0, width: 0 });
      expect(resizeObserverObserveMock).toHaveBeenCalledWith(element);
    });

    it('should initialize the component with the passed data', () => {
      const component = new TestComponent();
      component.init(document.createElement('div'), { data });
      expect(component['data']).toEqual(data);
      expect(component['config']).toEqual(defaultConfig);
    });

    it('should initialize the component with the passed config', () => {
      const component = new TestComponent();
      component.init(document.createElement('div'), { config });
      expect(component['data']).toBeUndefined();
      expect(component['config']).toEqual(config);
    });

    it('should initialize the component with the passed data and config', () => {
      const component = new TestComponent();
      component.init(document.createElement('div'), { data, config });
      expect(component['data']).toEqual(data);
      expect(component['config']).toEqual(config);
    });
  });

  describe('update', () => {
    it('should update the component with the passed data', () => {
      const component = new TestComponent();
      component.init(document.createElement('div'));
      component.update({ data });
      expect(component['data']).toEqual(data);
      expect(component['config']).toEqual(defaultConfig);
    });

    it('should update the component with the passed config', () => {
      const component = new TestComponent();
      component.init(document.createElement('div'));
      component.update({ config });
      expect(component['data']).toBeUndefined();
      expect(component['config']).toEqual(config);
    });

    it('should update the component with the passed data and config', () => {
      const component = new TestComponent();
      component.init(document.createElement('div'));
      component.update({ data, config });
      expect(component['data']).toEqual(data);
      expect(component['config']).toEqual(config);
    });

    it('should not throw an error when component is not initialized yet', () => {
      const component = new TestComponent();
      expect(() => component.update({ data, config })).not.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should destroy the component', () => {
      const component = new TestComponent();
      component.init(document.createElement('div'));
      component.destroy();
      expect(resizeObserverDisconnectMock).toHaveBeenCalled();
    });

    it('should not throw an error when component is not initialized yet', () => {
      const component = new TestComponent();
      expect(() => component.destroy()).not.toThrowError();
    });
  });
});
