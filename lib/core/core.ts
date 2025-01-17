import { defaultConfig, defaultPenConfig, DrawJsConfig, PenConfig, Point, Stroke } from "./templates";
import { DrawJsPointFunctions } from "./pointFunctions";

export default class DrawHtml {
  private config: DrawJsConfig = defaultConfig;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private penConfig: PenConfig = defaultPenConfig;
  private debugPoints: boolean = false;
  private pointerPosition: Point = new Point(0, 0);
  private isPointerDown: boolean = false;
  private points: Point[] = [];
  private strokes: Stroke[] = [];
  private isPenMode: boolean = true;


  private backCanvas: HTMLCanvasElement | null = null;
  private backCtx: CanvasRenderingContext2D | null = null;

  public constructor() {}

  public setPenMode(mode: boolean) {
    this.isPenMode = mode;
  }

  public get penMode() {
    return this.isPenMode;
  }

  public attach(canvas: HTMLCanvasElement, backCanvas: HTMLCanvasElement) {
    this.penConfig = this.config.pen;

    this.canvas = canvas;
    if (!this.canvas) {
      throw new Error("Canvas not found");
    }

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!this.ctx) {
      throw new Error("Canvas not found");
    }

    this.backCanvas = backCanvas;
    if (!this.backCanvas) {
      throw new Error("Canvas not found");
    }

    this.backCtx = this.backCanvas.getContext("2d") as CanvasRenderingContext2D;
    if (!this.backCtx) {
      throw new Error("Canvas not found");
    }

    this.canvas.addEventListener("resize", this.resize.bind(this));

    this.canvas.addEventListener("pointerdown", this.pointerDown.bind(this));
    this.canvas.addEventListener("pointermove", this.pointerMove.bind(this));
    this.canvas.addEventListener("pointerup", this.pointerUp.bind(this));
    this.canvas.addEventListener("pointerleave", this.pointerLeave.bind(this));

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

    this.resize();
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
      return this.canvas?.toDataURL("image/png");
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

  private pointsDrawStroke(points: Point[], penConfig: PenConfig, ctx: CanvasRenderingContext2D) {
    if (!ctx) return;

    ctx.strokeStyle = penConfig.color;
    ctx.lineWidth = penConfig.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    console.log(ctx.canvas.id)
    points.forEach((point, index) => {
      if (index === 0) {
        if (!ctx) return;
        ctx.moveTo(point.x, point.y);
      } else {
        if (!ctx) return;
        //this.ctx.moveTo(point.x, point.y);

        if(index === points.length - 1) {
          ctx.lineTo(point.x, point.y);
        } else {
          const xc = (point.x + points[index + 1].x) / 2;
          const yc = (point.y + points[index + 1].y) / 2;
        
          ctx.quadraticCurveTo(point.x, point.y, xc, yc);
        }
      }
    });
    ctx.stroke();
  }

  private pointsDrawSquare(points: Point[]) {
    if (!this.ctx) return;
    this.ctx.fillStyle = "blue";

    points.forEach((point) => {
      if (!this.ctx) return;
      this.ctx.fillRect(point.x, point.y, 3, 3);
    });
  }

  private redraw() {
    if (!this.ctx) return;
    if (!this.backCtx) return;
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.pointsDrawStroke(this.points, this.penConfig, this.ctx);

    if (this.isPointerDown) {
      this.points.push(this.pointerPosition);
    }

    if (this.debugPoints) {
      this.strokes.forEach((stroke) => {
        this.pointsDrawSquare(stroke.points);
      });

      this.pointsDrawSquare(this.points);
    }
    this.points = DrawJsPointFunctions.simplifyPoints(this.points);
  }

  private resize() {
    this.canvas?.getBoundingClientRect();
    this.canvas?.setAttribute("width", `${this.canvas?.clientWidth}`);
    this.canvas?.setAttribute("height", `${this.canvas?.clientHeight}`);

    this.backCanvas?.getBoundingClientRect();
    this.backCanvas?.setAttribute("width", `${this.backCanvas?.clientWidth}`);
    this.backCanvas?.setAttribute("height", `${this.backCanvas?.clientHeight}`);
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
    
      this.backCtx?.clearRect(0, 0, this.backCanvas?.width as number, this.backCanvas?.height as number);
      this.strokes.forEach((stroke) => {
        if (!this.backCtx) return console.error("No back context");
        this.pointsDrawStroke(DrawJsPointFunctions.simplifyPoints(stroke.points), stroke.config, this.backCtx);
      });
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
