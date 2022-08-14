import { Component } from '../common/component';
import { style } from '../common/style';
import { TreemapConfig, TreemapData, TreemapStyle } from './types';

export class Treemap extends Component<TreemapData, TreemapConfig, TreemapStyle> {
  public getDefaultStyle(): TreemapStyle {
    return {
      fill: style.colors.primary,
    };
  }
}

export * from './types';
