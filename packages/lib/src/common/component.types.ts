import { RequireAtLeastOne } from './require-at-least-one';

export type ComponentParams<
  DataType,
  ConfigType extends ComponentConfig,
  StyleType extends ComponentStyle,
> = RequireAtLeastOne<{
  data: DataType;
  config: RequireAtLeastOne<ConfigType>;
  style: RequireAtLeastOne<StyleType>;
}>;

export interface ComponentConfig<DatumType = any> {
  transitionsDuration: number | ComponentTransitionTimeFn<DatumType>;
}

export type ComponentTransitionTimeFn<DatumType = any> = (datum: DatumType, index: number) => number;

export type ComponentStyle = Record<string, any>;

export interface Size {
  width: number;
  height: number;
}

export interface ComponentMouseHandlerPayload {
  targetDetails: ComponentMouseHandlerTargetDetails;
}

export type ComponentMouseHandlerTargetDetails = Position & Size;

export interface Position {
  x: number;
  y: number;
}
