import { RequireAtLeastOne } from './require-at-least-one';

export type Params<DataType, ConfigType> = RequireAtLeastOne<{
  data: DataType;
  config: RequireAtLeastOne<ConfigType>;
}>;
