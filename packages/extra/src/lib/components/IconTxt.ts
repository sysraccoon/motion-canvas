import {
  Code,
  Icon,
  Layout,
  Node,
  Rect,
  RectProps,
  Txt,
  signal,
} from '@motion-canvas/2d';
import {DEFAULT, SignalValue, SimpleSignal} from '@motion-canvas/core';
import {rotateIn} from '../animations';
import {colors} from '../colorscheme';
import {defaultFont} from '../consts';

export interface IconTxtProps extends RectProps {
  icon: SignalValue<string>;
  text: SignalValue<string>;
}

export class IconTxt extends Rect {
  @signal()
  public declare readonly icon: SimpleSignal<string, this>;

  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  @signal()
  private declare readonly txtNode: SimpleSignal<Txt, this>;
  @signal()
  private declare readonly txtClip: SimpleSignal<Txt, this>;

  public constructor(props: IconTxtProps) {
    super({
      fill: colors.backgroundAlt,
      radius: 20,
      padding: 35,
      layout: true,
      direction: 'row',
      ...props,
    });

    this.add(
      new Node({
        children: [
          new Icon({
            icon: this.icon,
            size: 60,
            color: colors.foreground,
          }),
          new Layout({
            ref: this.txtClip,
            clip: true,
            children: [
              new Code({
                ref: this.txtNode,
                code: () => this.text(),
                fontFamily: defaultFont,
                fontSize: 50,
                marginLeft: 30,
                fill: colors.foreground,
              }),
            ],
          }),
        ],
      }),
    );
  }

  public *inTransition(duration: number = 0.5) {
    this.txtClip().width(0);
    yield* rotateIn(this);
    yield* this.txtClip().width(DEFAULT, duration);
  }
}
