export class CanvasUtils {
  private static readonly ID_ATTRIBUTE_NAME = 'data-dv-canvas-id';

  private static instances: Record<string, CanvasUtils> = {};

  private readonly context: CanvasRenderingContext2D;

  private constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error("[getContext('2d')] Canvas has already been set to a different context mode");
    }
    this.context = context;

    this.scaleByDevicePixelRatio();
  }

  public static draw(canvas: HTMLCanvasElement, ...elements: SVGElement[]): void {
    const instance = this.getInstance(canvas);
    elements.forEach((element: SVGElement) => instance.drawElement(element));
  }

  public static clear(canvas: HTMLCanvasElement): void {
    const instance = this.getInstance(canvas);
    instance.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  private static getInstance(canvas: HTMLCanvasElement): CanvasUtils {
    let id = canvas.getAttribute(this.ID_ATTRIBUTE_NAME);
    if (!id) {
      id = Object.keys(this.instances).length.toString();
      canvas.setAttribute(this.ID_ATTRIBUTE_NAME, id);
    }
    let instance = this.instances[id];
    if (!instance) {
      instance = new CanvasUtils(canvas);
      this.instances[id] = instance;
    }
    return instance;
  }

  private scaleByDevicePixelRatio(): void {
    const { height, width } = this.canvas.getBoundingClientRect();
    this.canvas.height = height * devicePixelRatio;
    this.canvas.width = width * devicePixelRatio;
    this.context.scale(devicePixelRatio, devicePixelRatio);
  }

  private drawElement(element: SVGElement, parentStyle?: CSSStyle): void {
    const drawElementFn = {
      g: () => {
        const children = Array.from(element.children) as SVGElement[];
        const style = this.getElementStyle(element, parentStyle);
        children.forEach((child: SVGElement) => this.drawElement(child, style));
      },
      circle: () => this.drawCircleElement(element as SVGCircleElement, parentStyle),
    }[element.tagName];
    if (!drawElementFn) {
      throw new Error(`[<${element.tagName}>] Element's tag name is not supported`);
    }
    drawElementFn();
  }

  private getElementStyle(element: SVGElement, parentStyle?: CSSStyle): CSSStyle {
    const { opacity, fill, stroke, strokeWidth } = getComputedStyle(element);
    const style = { opacity, fill, stroke, strokeWidth };
    return {
      ...parentStyle,
      ...style,
      opacity: (Number(opacity ?? 1) * Number(parentStyle?.opacity ?? 1)).toString(),
    };
  }

  private drawCircleElement(element: SVGCircleElement, parentStyle?: CSSStyle): void {
    const style = this.getElementStyle(element, parentStyle);
    this.context.globalAlpha = Number(style.opacity);
    this.context.beginPath();
    this.context.arc(
      Number(element.getAttribute('cx') ?? 0),
      Number(element.getAttribute('cy') ?? 0),
      Number(element.getAttribute('r') ?? 0),
      0,
      2 * Math.PI,
    );
    this.fill(style);
    this.stroke(style);
  }

  private fill(style: CSSStyle): void {
    if (!!style.fill) {
      this.context.fillStyle = style.fill;
      this.context.fill();
    }
  }

  private stroke(style: CSSStyle): void {
    if (!!style.stroke) {
      this.context.strokeStyle = style.stroke;
      this.context.lineWidth = parseFloat(style.strokeWidth) | 1;
      this.context.stroke();
    }
  }
}

interface CSSStyle {
  opacity: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
}
