import { PenConfig, Point, Stroke } from "./helpers";
import { DrawJsPointFunctions } from "./pointFunctions";

interface DrawJsConfig {
  pen: PenConfig;
  pointsPipeline: Array<(points: Point[]) => Point[]>;
  debugPoints: boolean;
}

const defaultConfig: DrawJsConfig = {
  debugPoints: false,
  pen: { color: "black", width: 5 },
  pointsPipeline: [
    DrawJsPointFunctions.simplifyPoints,
    DrawJsPointFunctions.distributePoints,
    DrawJsPointFunctions.smoothPoints,
  ],
};
const defaultPenConfig: PenConfig = { color: "black", width: 5 };

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

  public constructor() {}

  public attach(canvas: HTMLCanvasElement) {
    this.penConfig = this.config.pen;

    this.canvas = canvas;
    if (!this.canvas) {
      throw new Error("Canvas not found");
    }

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!this.ctx) {
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

  private pointsDrawStroke(points: Point[], penConfig: PenConfig) {
    if (!this.ctx) return;

    this.ctx.strokeStyle = penConfig.color;
    this.ctx.lineWidth = penConfig.width;

    this.ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        if (!this.ctx) return;
        this.ctx.moveTo(point.x, point.y);
      } else {
        if (!this.ctx) return;
        this.ctx.moveTo(points[index-1].x, points[index-1].y);

        const vector = new Point( point.x - points[index - 1].x, point.y - points[index - 1].y );
        const vectorInverted = new Point(-vector.x, -vector.y);
        
        this.ctx.bezierCurveTo(point.x - vector.x / 2, point.y - vector.y / 2, point.x - vectorInverted.x / 2, point.y - vectorInverted.y / 2, point.x, point.y);
      }
    });
    this.ctx.stroke();
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
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.strokes.forEach((stroke) => {
      this.pointsDrawStroke(stroke.points, stroke.config);
    });

    this.pointsDrawStroke(this.points, this.penConfig);

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
    e.preventDefault();
    if (this.isPointerDown) {
      let points = this.points;

      this.config.pointsPipeline.forEach((pipeline) => {
        points = pipeline(points);
      });

      this.strokes.push(new Stroke(this.points, this.penConfig));
      this.points = [];
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
        this.pointerPosition = new Point(e.offsetX, e.offsetY);
        break;
      default:
        throw new Error("Unknown pointer type");
    }
    this.redraw();
  }
}
