import { ComponentConfig, ComponentParams, ComponentStyle, Size } from './component.types';

export abstract class Component<
  DataType,
  ConfigType extends ComponentConfig,
  StyleType extends ComponentStyle,
  HandlersType = void,
> {
  protected element: HTMLElement;

  protected data: DataType | undefined;

  protected config: ConfigType;

  protected style: StyleType;

  protected handlers: HandlersType | undefined;

  protected size: Size;

  private resizeObserver: ResizeObserver;
  private resizeObserverInitialized = false;

  public constructor({
    element,
    params,
    handlers,
  }: {
    element: HTMLElement;
    params?: ComponentParams<DataType, ConfigType, StyleType>;
    handlers?: HandlersType;
  }) {
    this.element = element;

    this.data = params?.data;
    const config = this.getDefaultConfig();
    if (!!params?.config) {
      Object.assign(config, params.config);
    }
    this.config = config;
    const style = this.getDefaultStyle();
    if (!!params?.style) {
      Object.assign(style, params.style);
    }
    this.style = style;

    this.handlers = handlers;

    const { width, height } = element.getBoundingClientRect();
    this.size = {
      width,
      height,
    };
    this.resizeObserver = new ResizeObserver((entries) => {
      if (!this.resizeObserverInitialized) {
        this.resizeObserverInitialized = true;
      } else {
        const { width, height } = entries.slice(-1)[0]?.contentRect;
        this.resize({
          width,
          height,
        });
      }
    });
    this.resizeObserver.observe(element);
  }

  public update(params: ComponentParams<DataType, ConfigType, StyleType>): void {
    if (params.hasOwnProperty('data')) {
      this.data = params.data;
    }
    if (!!params.config) {
      Object.assign(this.config, params.config);
    }
    if (!!params.style) {
      Object.assign(this.style, params.style);
    }
  }

  public destroy(): void {
    this.resizeObserver.disconnect();
  }

  protected getDefaultConfig(): ConfigType {
    return {
      transitionsDuration: 500,
    } as ConfigType;
  }

  protected abstract getDefaultStyle(): StyleType;

  protected resize(size: Size): void {
    this.size = size;
  }
}
