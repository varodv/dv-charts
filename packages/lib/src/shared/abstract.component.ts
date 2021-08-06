import { Component } from './models/component';
import { Config } from './models/config';
import { Params } from './models/params';
import { RequireAtLeastOne } from './models/require-at-least-one';

export abstract class AbstractComponent<DataType, ConfigType extends Config>
  implements Component<DataType, ConfigType>
{
  protected element?: HTMLElement;

  protected data?: DataType;

  protected config: ConfigType;

  constructor(config?: RequireAtLeastOne<ConfigType>) {
    this.config = Object.assign(this.getDefaultConfig(), config);
  }

  public init(element: HTMLElement, params?: Params<DataType, ConfigType>): void {
    this.element = element;

    const { data, config } = params || {};
    if (!!data) {
      this.data = data;
    }

    if (!!config) {
      this.config = Object.assign(this.config, config);
    }
  }

  public update({ data, config }: Params<DataType, ConfigType>): void {
    if (!!data) {
      this.data = data;
    }

    if (!!config) {
      this.config = Object.assign(this.config, config);
    }
  }

  public abstract destroy(): void;

  protected getDefaultConfig(): any {
    return {
      animationsDurationInMillis: 400,
    };
  }
}
