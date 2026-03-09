import {
  Circle,
  Icon,
  IconProps,
  Layout,
  Node,
  Rect,
  RectProps,
  Txt,
  initial,
  signal,
} from '@motion-canvas/2d';
import {
  ColorSignal,
  PossibleColor,
  Reference,
  SignalValue,
  SimpleSignal,
  Vector2,
  all,
  createRef,
} from '@motion-canvas/core';
import {colors} from '../colorscheme';
import {defaultFont} from '../consts';
import {icons} from '../icons';

export interface FileProps extends RectProps {
  name: SignalValue<string>;
  iconProps?: IconProps;
  foregroundColor?: SignalValue<PossibleColor>;
}

export class File extends Rect {
  @signal()
  public declare readonly name: SimpleSignal<string, this>;

  @initial(colors.foreground)
  @signal()
  public declare readonly foregroundColor: ColorSignal<this>;

  private readonly accentNode: Reference<File> = createRef<File>();

  public constructor(props: FileProps) {
    super({
      padding: [10, 14],
      radius: 20,
      fill: colors.base16[0x2],
      gap: 20,
      marginTop: 12,
      grow: 1,
      shrink: 1,
      ...props,
      layout: true,
      alignItems: 'center',
      direction: 'row',
      clip: true,
    });

    this.add(
      new Node({
        children: [
          new Layout({
            ref: this.accentNode,
            layout: false,
            size: () => this.size(),
          }),
          new Icon({
            icon: this.peekIcon(),
            size: 38,
            color: this.foregroundColor,
            ...props.iconProps,
          }),
          new Txt({
            text: this.name,
            fontFamily: defaultFont,
            fontSize: 38,
            fill: this.foregroundColor,
          }),
        ],
      }),
    );
  }

  public *waveChangeAccent(
    color: SignalValue<PossibleColor>,
    duration: number = 0.4,
    basePosition: Vector2 = Vector2.zero,
  ) {
    const accentCircle = new Circle({
      position: basePosition,
      fill: color,
      size: 0,
    });
    this.accentNode().add(accentCircle);
    yield* all(
      accentCircle.size(Math.max(this.size().x, this.size().y), duration),
      this.fill(color, duration),
    );
    accentCircle.remove().dispose();
  }

  private peekIcon(): string {
    const extMatch = this.name().match(/[^\\]*\.(\w+)$/);
    if (extMatch) {
      const extension = extMatch[1];
      if (extension in icons) {
        return (icons as any)[extension];
      }
    }

    return icons.file;
  }
}
