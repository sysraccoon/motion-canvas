import {
  Shape,
  ShapeProps,
  initial,
  nodeName,
  vector2Signal,
} from '@motion-canvas/2d';
import {PossibleVector2, SignalValue, Vector2Signal} from '@motion-canvas/core';

export interface DotSphereProps extends ShapeProps {
  spacing?: SignalValue<PossibleVector2>;
  dotOffset?: SignalValue<PossibleVector2>;
}

@nodeName('DotSphere')
export class DotSphere extends Shape {
  @initial(80)
  @vector2Signal('spacing')
  public declare readonly spacing: Vector2Signal<this>;

  @initial(0)
  @vector2Signal('dotOffset')
  public declare readonly dotOffset: Vector2Signal<this>;

  public constructor(props: DotSphereProps) {
    super(props);
  }

  protected override drawShape(context: CanvasRenderingContext2D) {
    context.save();
    this.applyStyle(context);
    this.drawRipple(context);

    const spacing = this.spacing();
    const size = this.computedSize().scale(0.5);
    const steps = size.div(spacing).floored;

    const radius = Math.max(size.x, size.y);

    const rawOffsetX = this.dotOffset().x || 0;
    const rawOffsetY = this.dotOffset().y || 0;

    const getCyclicFraction = (value: number): number => {
      const absValue = Math.abs(value);
      const fraction = absValue - Math.floor(absValue);

      return value >= 0 ? fraction : 1 - fraction;
    };

    const cycleX = getCyclicFraction(rawOffsetX);
    const cycleY = getCyclicFraction(rawOffsetY);

    const extraSteps = 1;

    for (let x = -steps.x - extraSteps; x <= steps.x + extraSteps; x++) {
      for (let y = -steps.y - extraSteps; y <= steps.y + extraSteps; y++) {
        const integerPartX =
          Math.floor(Math.abs(rawOffsetX)) * (rawOffsetX >= 0 ? 1 : -1);
        const integerPartY =
          Math.floor(Math.abs(rawOffsetY)) * (rawOffsetY >= 0 ? 1 : -1);

        const adjustedIntegerX =
          rawOffsetX >= 0 ? integerPartX : -integerPartX - 1;
        const adjustedIntegerY =
          rawOffsetY >= 0 ? integerPartY : -integerPartY - 1;

        const shiftedX = x + cycleX + adjustedIntegerX;
        const shiftedY = y + cycleY + adjustedIntegerY;

        const gridWidth = steps.x * 2 + 1;
        const gridHeight = steps.y * 2 + 1;

        const wrapX =
          ((((shiftedX + steps.x) % gridWidth) + gridWidth) % gridWidth) -
          steps.x;
        const wrapY =
          ((((shiftedY + steps.y) % gridHeight) + gridHeight) % gridHeight) -
          steps.y;

        const flatX = spacing.x * (wrapX + (cycleX - Math.floor(cycleX)));
        const flatY = spacing.y * (wrapY + (cycleY - Math.floor(cycleY)));

        const nx = flatX / radius;
        const ny = flatY / radius;
        const r = Math.sqrt(nx * nx + ny * ny);

        if (r > 1) continue;

        const theta = Math.asin(r);
        const scale = r > 0 ? theta / r : 1;
        const sphereX = nx * scale * radius;
        const sphereY = ny * scale * radius;

        context.beginPath();
        context.moveTo(sphereX, sphereY);
        context.lineTo(sphereX + this.lineWidth(), sphereY);
        context.stroke();
      }
    }

    context.restore();
  }
}
