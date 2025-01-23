import {
  defaultConfig,
  defaultPenConfig,
  DrawJsConfig,
  PenConfig,
  Point,
  Stroke,
} from "./templates";
import { simplifyPoints } from "./pointFunctions";
import Canvas from "./canvas";

export default class FinelinerCore {
  private _config: DrawJsConfig = defaultConfig;
  private _penConfig: PenConfig = defaultPenConfig;

  private _frontCanvas: Canvas | null = null;
  private _backCanvas: Canvas | null = null;

  private _pointerPosition: Point = new Point(0, 0);
  private _isPointerDown: boolean = false;

  private _usingStyles: boolean = true;

  private _debugMode: boolean = false;

  private _points: Point[] = [];
  private _strokes: Stroke[] = [];

  private _deltaCallback: (stroke: Stroke) => void = () => {};

  public constructor() {}

  public attach(canvas: HTMLCanvasElement, backCanvas: HTMLCanvasElement) {
    this._penConfig = this._config.pen;

    this._frontCanvas = new Canvas(canvas);
    this._backCanvas = new Canvas(backCanvas);

    void this._registerEvents(this._frontCanvas.canvas);
  }

  public setDeltaCallback(deltaCallback: (stroke: Stroke) => void) {
    this._deltaCallback = deltaCallback;
  }

  public get penConfig(): PenConfig {
    return this._penConfig;
  }

  public setPenConfig(config: PenConfig) {
    this._penConfig = config;
  }

  public setUsingStyles(mode: boolean) {
    this._usingStyles = mode;
  }

  public get usingStyles() {
    return this._usingStyles;
  }

  public setDebugMode(status: boolean) {
    this._debugMode = status;
    void this._redraw();
  }

  public get debugMode() {
    return this._debugMode;
  }

  public setConfig(config: Partial<DrawJsConfig>) {
    this._config = { ...this._config, ...config };
  }

  public get config() {
    return this._config;
  }

  public export(type: "image" | "json") {
    if (type === "image") {
      return this._backCanvas?.canvas.toDataURL("image/png");
    } else {
      return JSON.stringify(this._strokes);
    }
  }

  public import(data: string) {
    const strokes = JSON.parse(data);
    this._strokes = strokes.map((stroke: Stroke) => {
      return new Stroke(
        stroke.points.map((point: Point) => new Point(point.x, point.y)),
        stroke.config
      );
    });
    void this._redraw();
  }

  private _redraw() {
    if (!this._frontCanvas) return;
    this._frontCanvas.clear();

    this._frontCanvas.drawStroke(this._points, this._penConfig);

    if (this._isPointerDown) {
      this._points.push(this._pointerPosition);
    }

    if (this._debugMode) {
      this._strokes.forEach((stroke) => {
        this._frontCanvas?.drawPoints(stroke.points, "red");
      });

      this._frontCanvas?.drawPoints(this._points, "red");
    }
    this._points = simplifyPoints(this._points);
  }

  private _registerEvents(canvas: HTMLCanvasElement) {
    if (!this._frontCanvas) return;
    this._frontCanvas.registerEvent(
      "pointerdown",
      this._pointerDown.bind(this)
    );
    this._frontCanvas.registerEvent(
      "pointermove",
      this._pointerMove.bind(this)
    );
    this._frontCanvas.registerEvent("pointerup", this._pointerUp.bind(this));
    this._frontCanvas.registerEvent(
      "pointerleave",
      this._pointerLeave.bind(this)
    );
    this._frontCanvas.registerEvent("ratechange", (e) => {
      console.log(e);
    });

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

  private _pointerDown(e: PointerEvent) {
    if (e.pointerType === "touch" && !this._usingStyles) return;
    e.preventDefault();
    void this._updatePointerPosition(e);
    this._isPointerDown = true;
  }

  private _pointerMove(e: PointerEvent) {
    e.preventDefault();
    void this._updatePointerPosition(e);
  }

  private _pointerUp(e: PointerEvent) {
    if (e.pointerType === "touch" && !this._usingStyles) return;
    e.preventDefault();
    if (this._isPointerDown) {
      const stroke = new Stroke(this._points, this._penConfig)
      this._strokes.push(stroke);
      this._points = [];
      this._deltaCallback(stroke);

      this._backCanvas?.clear();
      this._backCanvas?.drawStrokes(this._strokes);
    }

    this._isPointerDown = false;
    void this._updatePointerPosition(e);
  }

  private _pointerLeave(e: PointerEvent) {
    void this._updatePointerPosition(e);
  }

  private _updatePointerPosition(e: PointerEvent) {
    switch (e.pointerType) {
      case "mouse":
        this._pointerPosition = new Point(e.offsetX, e.offsetY);
        break;
      case "pen":
        this._pointerPosition = new Point(e.offsetX, e.offsetY);
        break;
      case "touch":
        if (!this._usingStyles)
          this._pointerPosition = new Point(e.offsetX, e.offsetY);
        break;
      default:
        throw new Error("Unknown pointer type");
    }
    this._redraw();
  }
}
