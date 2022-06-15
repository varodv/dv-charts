import { RequireAtLeastOne } from './require-at-least-one';

export type ComponentParams<DataType, ConfigType extends ComponentConfig> = RequireAtLeastOne<{
  data: DataType;
  config: RequireAtLeastOne<ConfigType>;
}>;

export interface ComponentConfig {
  transitionsDuration: number;
}

export interface Size {
  width: number;
  height: number;
}
