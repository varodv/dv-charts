import { Component } from './models/component';
import { Config } from './models/config';
import { Params } from './models/params';
import { RequireAtLeastOne } from './models/require-at-least-one';
import { Size } from './models/size';

import { select, Selection } from 'd3-selection';

export abstract class AbstractComponent<DataType, ConfigType extends Config>
  implements Component<DataType, ConfigType>
{
  protected element?: Selection;

  protected data?: DataType;

  protected config: ConfigType;

  protected size?: Size;

  private resizeObserver?: ResizeObserver;
  private isResizeObserverInitialized = false;

  constructor(config?: RequireAtLeastOne<ConfigType>) {
    this.config = Object.assign(this.getDefaultConfig(), config);
  }

  public init(element: HTMLElement, params?: Params<DataType, ConfigType>): void {
    this.element = select(element);

    const { data, config } = params || {};
    if (!!data) {
      this.data = data;
    }

    if (!!config) {
      this.config = Object.assign(this.config, config);
    }

    const { height, width } = element.getBoundingClientRect();
    this.size = {
      height,
      width,
    };

    this.resizeObserver = new ResizeObserver((entries): void => {
      entries.forEach((entry): void => {
        if (!this.isResizeObserverInitialized) {
          this.isResizeObserverInitialized = true;
        } else {
          const { height, width } = entry.contentRect;
          this.size = {
            height,
            width,
          };
          this.resize();
        }
      });
    });
    this.resizeObserver.observe(element);
  }

  public update({ data, config }: Params<DataType, ConfigType>): void {
    if (!!data) {
      this.data = data;
    }

    if (!!config) {
      this.config = Object.assign(this.config, config);
    }
  }

  public destroy(): void {
    this.resizeObserver?.disconnect();
  }

  protected getDefaultConfig(): any {
    return {
      animationsDurationInMillis: 400,
    };
  }

  protected abstract resize(): void;
}
