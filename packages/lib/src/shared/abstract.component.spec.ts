import { AbstractComponent } from './abstract.component';

import { Config } from './models/config';
import { Size } from './models/size';

class TestComponent extends AbstractComponent<number[], Config> {
  protected resize(): void {
    return;
  }
}

describe('AbstractComponent', () => {
  const element = document.createElement('div');
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
      component.init(element);
      expect(component['element']!.node()).toEqual(element);
      expect(component['data']).toBeUndefined();
      expect(component['config']).toEqual(defaultConfig);
      expect(component['size']).toEqual({ height: 0, width: 0 });
      expect(window.ResizeObserver).toHaveBeenLastCalledWith(component['resizeObserverCallback']);
      expect(resizeObserverObserveMock).toHaveBeenCalledWith(element);
    });

    it('should initialize the component with the passed data', () => {
      const component = new TestComponent();
      component.init(element, { data });
      expect(component['data']).toEqual(data);
      expect(component['config']).toEqual(defaultConfig);
    });

    it('should initialize the component with the passed config', () => {
      const component = new TestComponent();
      component.init(element, { config });
      expect(component['data']).toBeUndefined();
      expect(component['config']).toEqual(config);
    });

    it('should initialize the component with the passed data and config', () => {
      const component = new TestComponent();
      component.init(element, { data, config });
      expect(component['data']).toEqual(data);
      expect(component['config']).toEqual(config);
    });
  });

  describe('update', () => {
    it('should update the component with the passed data', () => {
      const component = new TestComponent();
      component.init(element);
      component.update({ data });
      expect(component['data']).toEqual(data);
      expect(component['config']).toEqual(defaultConfig);
    });

    it('should update the component with the passed config', () => {
      const component = new TestComponent();
      component.init(element);
      component.update({ config });
      expect(component['data']).toBeUndefined();
      expect(component['config']).toEqual(config);
    });

    it('should update the component with the passed data and config', () => {
      const component = new TestComponent();
      component.init(element);
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
    let component: TestComponent;
    beforeEach(() => {
      component = new TestComponent();
    });

    it('should destroy the component', () => {
      component.init(element);
      component.destroy();
      expect(resizeObserverDisconnectMock).toHaveBeenCalled();
    });

    it('should not throw an error when component is not initialized yet', () => {
      expect(() => component.destroy()).not.toThrowError();
    });
  });

  describe('resizeObserverCallback', () => {
    const size: Size = {
      height: 100,
      width: 200,
    };
    const entry = {
      target: element,
      contentRect: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        x: 0,
        y: 0,
        height: size.height,
        width: size.width,
        toJSON: () => ({}),
      },
      borderBoxSize: [],
      contentBoxSize: [],
    } as ResizeObserverEntry;

    let component: TestComponent;
    const resizeMock = jest.fn();
    beforeEach(() => {
      component = new TestComponent();
      component['resize'] = resizeMock;

      // This emulates the first ResizeObserver execution caused by its default .observe() implentation
      resizeObserverObserveMock.mockImplementation(() => component['resizeObserverCallback']([]));
    });

    it('should not fire a resize on component init', () => {
      component.init(element);
      expect(resizeMock).not.toHaveBeenCalled();
    });

    it('should fire a resize (one) after component init', () => {
      component.init(element);
      component['resizeObserverCallback']([entry, entry]);
      expect(resizeMock).toHaveBeenCalledTimes(1);
      expect(component['size']).toEqual(size);
    });
  });
});
