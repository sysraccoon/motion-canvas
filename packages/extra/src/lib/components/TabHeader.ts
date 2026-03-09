import {
  CanvasStyleSignal,
  Layout,
  LayoutProps,
  Node,
  Path,
  PossibleCanvasStyle,
  Rect,
  canvasStyleSignal,
  initial,
} from '@motion-canvas/2d';
import {SignalValue} from '@motion-canvas/core';
import {colors} from '../colorscheme';
import {defaultFont} from '../consts';

export interface TabHeaderProps extends LayoutProps {
  fill?: SignalValue<PossibleCanvasStyle>;
}

export class TabHeader extends Layout {
  @initial(colors.backgroundAlt)
  @canvasStyleSignal()
  public declare readonly fill: CanvasStyleSignal<this>;

  public constructor(props: TabHeaderProps) {
    super({
      fontFamily: defaultFont,
      fontSize: 30,
      offset: [-1, 1],
      ...props,
      layout: true,
      alignItems: 'end',
    });

    this.add(
      new Node({
        children: [
          new Rect({
            padding: [15, 30],
            fill: this.fill,
            radius: [20, 20, 0, 0],
            children: props.children,
          }),
          new Path({
            data: 'M0,25L0,0S0,25,25,25Z',
            fill: this.fill,
          }),
        ],
      }),
    );
  }
}
