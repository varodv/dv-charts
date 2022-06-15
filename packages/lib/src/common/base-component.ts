import { ComponentConfig, ComponentParams, Size } from './component.types';

export class BaseComponent<DataType, ConfigType extends ComponentConfig> {
  protected data: DataType | undefined;

  protected config: ConfigType;

  protected size: Size;

  private resizeObserver: ResizeObserver;
  private resizeObserverInitialized = false;

  protected constructor(protected element: HTMLElement, params?: ComponentParams<DataType, ConfigType>) {
    this.data = params?.data;
    const config = this.getDefaultConfig();
    if (!!params?.config) {
      Object.assign(config, params.config);
    }
    this.config = config;

    const { width, height } = element.getBoundingClientRect();
    this.size = {
      width,
      height,
    };
    this.resizeObserver = new ResizeObserver((entries) => {
      if (!this.resizeObserverInitialized) {
        this.resizeObserverInitialized = true;
      } else {
        const { width, height } = entries.slice(-1)[0]!.contentRect;
        this.resize({
          width,
          height,
        });
      }
    });
    this.resizeObserver.observe(element);
  }

  public static create(
    element: HTMLElement,
    params?: ComponentParams<unknown, ComponentConfig>,
  ): BaseComponent<unknown, ComponentConfig> {
    return new BaseComponent(element, params);
  }

  public update(params: ComponentParams<DataType, ConfigType>): void {
    if (params.hasOwnProperty('data')) {
      this.data = params.data;
    }
    if (!!params.config) {
      Object.assign(this.config, params.config);
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

  protected resize(size: Size): void {
    this.size = size;
  }
}
