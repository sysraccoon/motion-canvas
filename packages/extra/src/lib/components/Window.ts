import {
  Circle,
  Icon,
  initial,
  Layout,
  Rect,
  RectProps,
  signal,
  Txt,
} from '@motion-canvas/2d';
import {SignalValue, SimpleSignal} from '@motion-canvas/core';
import {colors} from '../colorscheme';
import {defaultFont} from '../consts';
import {icons} from '../icons';

export interface WindowProps extends RectProps {
  title: SignalValue<string>;
  icon: SignalValue<string>;
}

export class Window extends Rect {
  @signal()
  public declare readonly title: SimpleSignal<string, this>;

  @initial(icons.window)
  @signal()
  public declare readonly icon: SimpleSignal<string, this>;

  @signal()
  public declare readonly topBar: SimpleSignal<Layout, this>;

  public constructor(props: WindowProps) {
    super({
      fill: colors.backgroundAlt,
      padding: 40,
      radius: 20,
      ...props,
      layout: true,
      direction: 'column',
    });

    this.add(
      new Layout({
        ref: this.topBar,
        gap: 16,
        alignItems: 'center',
        marginBottom: 32,
        children: [
          new Icon({
            icon: this.icon,
            size: 34,
            color: colors.foreground,
          }),
          new Txt({
            text: this.title,
            fill: colors.foreground,
            fontSize: 36,
            fontFamily: defaultFont,
          }),
          new Layout({
            grow: 1,
          }),
          new Circle({
            size: 34,
            fill: colors.green,
          }),
          new Circle({
            size: 34,
            fill: colors.yellow,
          }),
          new Circle({
            size: 34,
            fill: colors.red,
          }),
        ],
      }),
    );

    this.add(
      new Layout({
        grow: 1,
        children: props.children,
      }),
    );
  }
}
