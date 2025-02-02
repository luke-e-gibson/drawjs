import { PenConfig, Point, Stroke } from "./templates";

export default class Canvas {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    if(!this._canvas) throw new Error("Canvas not found");
  
    this._ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if(!this._ctx) throw new Error("2D context could not be created");

    void this._registerEventListeners();
    void this._resize();
  }
  
  public drawStroke(points: Point[], penConfig: PenConfig) {
    this.ctx.strokeStyle = penConfig.color;
    this.ctx.lineWidth = penConfig.width;
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        if (!this.ctx) return;
        //this.ctx.moveTo(point.x, point.y);

        if(index === points.length - 1) {
          this.ctx.lineTo(point.x, point.y);
        } else {
          const xc = (point.x + points[index + 1].x) / 2;
          const yc = (point.y + points[index + 1].y) / 2;
        
          this.ctx.quadraticCurveTo(point.x, point.y, xc, yc);
        }
      }
    });
    this.ctx.stroke();
  }

  public drawStrokes(strokes: Stroke[]) {
    strokes.forEach((stroke) => {
      this.drawStroke(stroke.points, stroke.config);
    });

  }

  public clear() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  public drawPoints(points: Point[], color: string) {
    this.ctx.fillStyle = color;

    points.forEach((point) => {
      this.ctx.fillRect(point.x, point.y, 3, 3);
    });
  }
  
  public get ctx() {
    return this._ctx;
  }

  public get canvas() {
    return this._canvas;
  }

  public registerEvent<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLCanvasElement, ev: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void {
    this._canvas.addEventListener(type, listener, options);
  }

  private _registerEventListeners() {
    this._canvas.addEventListener("resize", this._resize.bind(this));
  }

  private _resize() {
    this._canvas.width = this.canvas.clientWidth;
    this._canvas.height = this.canvas.clientHeight;
  }
}
