import { defaultConfig, defaultPenConfig, DrawJsConfig, PenConfig, Point, Stroke } from "./templates";
import { DrawJsPointFunctions } from "./pointFunctions";
import Canvas from "./canvas";

export default class DrawHtml {
  private config: DrawJsConfig = defaultConfig;
  private ctx: CanvasRenderingContext2D | null = null;
  private penConfig: PenConfig = defaultPenConfig;
  private debugPoints: boolean = false;
  private pointerPosition: Point = new Point(0, 0);
  private isPointerDown: boolean = false;
  private points: Point[] = [];
  private strokes: Stroke[] = [];
  private isPenMode: boolean = true;
  
  private frontCanvas: Canvas | null = null;
  private backCanvas: Canvas | null = null;


  public constructor() {}

  public setPenMode(mode: boolean) {
    this.isPenMode = mode;
  }

  public get penMode() {
    return this.isPenMode;
  }

  public attach(canvas: HTMLCanvasElement, backCanvas: HTMLCanvasElement) {
    this.penConfig = this.config.pen;

    this.frontCanvas = new Canvas(canvas);
    this.backCanvas = new Canvas(backCanvas);

    this.frontCanvas.registerEvent("pointerdown", this.pointerDown.bind(this));
    this.frontCanvas.registerEvent("pointermove", this.pointerMove.bind(this));
    this.frontCanvas.registerEvent("pointerup", this.pointerUp.bind(this));
    this.frontCanvas.registerEvent("pointerleave", this.pointerLeave.bind(this));
    this.frontCanvas.registerEvent("ratechange", (e) => {console.log(e)});


    document.body.addEventListener(
      "touchstart",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchend",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchmove",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }

  public get PenConfig(): PenConfig {
    return this.penConfig;
  }

  public toggleDebugPoints() {
    this.debugPoints = !this.debugPoints;
    void this.redraw();
  }

  public setConfig(config: Partial<DrawJsConfig>) {
    this.config = { ...this.config, ...config };
  }

  public updatePenConfig(config: PenConfig) {
    this.penConfig = config;
  }

  public export(type: "image" | "json") {
    if (type === "image") {
      return this.frontCanvas?.canvas.toDataURL("image/png");
    } else {
      return JSON.stringify(this.strokes);
    }
  }

  public import(data: string) {
    const strokes = JSON.parse(data);
    this.strokes = strokes.map((stroke: Stroke) => {
      return new Stroke(
        stroke.points.map((point: Point) => new Point(point.x, point.y)),
        stroke.config
      );
    });
    void this.redraw();
  }

  private redraw() {
    if (!this.frontCanvas) return;
    this.frontCanvas.clear();
    
    this.frontCanvas.drawStroke(this.points, this.penConfig);

    if (this.isPointerDown) {
      this.points.push(this.pointerPosition);
    }

    if (this.debugPoints) {
      this.strokes.forEach((stroke) => {
        this.frontCanvas?.drawPoints(stroke.points, "red");
      });

      this.frontCanvas?.drawPoints(this.points, "red");
    }
    this.points = DrawJsPointFunctions.simplifyPoints(this.points);
  }

  private pointerDown(e: PointerEvent) {
    e.preventDefault();
    void this.updatePointerPosition(e);
    this.isPointerDown = true;
  }

  private pointerMove(e: PointerEvent) {
    e.preventDefault();
    void this.updatePointerPosition(e);
  }

  private pointerUp(e: PointerEvent) {
    if(e.pointerType === "touch" && !this.isPenMode) return;
    e.preventDefault();
    if (this.isPointerDown) {
      this.strokes.push(new Stroke(this.points, this.penConfig));
      this.points = [];
      
      this.backCanvas?.clear();
      this.backCanvas?.drawStrokes(this.strokes);
    }

    this.isPointerDown = false;
    void this.updatePointerPosition(e);
  }

  private pointerLeave(e: PointerEvent) {
    void this.updatePointerPosition(e);
  }

  private updatePointerPosition(e: PointerEvent) {
    switch (e.pointerType) {
      case "mouse":
        this.pointerPosition = new Point(e.offsetX, e.offsetY);
        break;
      case "pen":
        this.pointerPosition = new Point(e.offsetX, e.offsetY);
        break;
      case "touch":
        if(!this.isPenMode) this.pointerPosition = new Point(e.offsetX, e.offsetY);
        break;
      default:
        throw new Error("Unknown pointer type");
    }
    this.redraw();
  }
}
