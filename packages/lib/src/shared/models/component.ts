import { Params } from './params';

export interface Component<DataType, ConfigType> {
  init(element: HTMLElement, params?: Params<DataType, ConfigType>): void;

  update(params: Params<DataType, ConfigType>): void;

  destroy(): void;
}
