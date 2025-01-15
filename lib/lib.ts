import { PenConfig, Point, Stroke } from "./helpers";
import { DrawJsPointFunctions } from "./pointFunctions";


interface DrawJsConfig {
  pen: PenConfig;
  pointsPipeline: Array<(points: Point[]) => Point[]>;
  debugPoints: boolean;
}


export default class DrawHtml {
  private config: DrawJsConfig = {
    debugPoints: false,
    pen: { color: 'black', width: 5 },
    pointsPipeline: [
        DrawJsPointFunctions.distributePoints,
        DrawJsPointFunctions.smoothPoints,
    ]
  }
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private penConfig: PenConfig = { color: 'black', width: 5 };
  public get PenConfig() : PenConfig { return this.penConfig; }

  private debugPoints: boolean = false;
  public toggleDebugPoints() {
    this.debugPoints = !this.debugPoints;
    void this.redraw();
  }

  private mousePosition: Point = new Point(0, 0);
  private isMouseDown: boolean = false

  private points: Point[] = [];
  private strokes: Stroke[] = [];

  public constructor() {}

  public setConfig(config: Partial<DrawJsConfig>) {
    this.config = {...this.config, ...config};
  }

  public attach(canvas: HTMLCanvasElement) {
    this.penConfig = this.config.pen;

    this.canvas = canvas
    if(!this.canvas) { throw new Error('Canvas not found'); }

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if(!this.ctx) { throw new Error('Canvas not found'); }

    this.canvas.addEventListener('resize', this.resize.bind(this));
    this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.mouseUp.bind(this));
    this.canvas.addEventListener("resize", this.resize.bind(this));


    this.resize();
  }

  public updatePenConfig(config: PenConfig) {
    this.penConfig = config;
    console.log(this.penConfig);
  }

  public export(type: "image" | "json") {
    if(type === 'image') {
      return this.canvas?.toDataURL('image/png');
    } else {
      return JSON.stringify(this.strokes);
    }
  }

  public import(data: string) {
    const strokes = JSON.parse(data);
    this.strokes = strokes.map((stroke: Stroke) => {
      return new Stroke(stroke.points.map((point: Point) => new Point(point.x, point.y)), stroke.config);
    });
    void this.redraw();
  }

  private redraw() {
    if(!this.ctx) { return; }
    if(!this.canvas) { return; }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.strokes.forEach(stroke => {
        if(!this.ctx) { return; }
        this.ctx.strokeStyle = stroke.config.color;
        this.ctx.lineWidth = stroke.config.width;

        this.ctx.beginPath();
        stroke.points.forEach((point, index) => {
          if(index === 0) {
            if(!this.ctx) { return; }
            this.ctx.moveTo(point.x, point.y);
          } else {
            if(!this.ctx) { return; }
            this.ctx.lineTo(point.x, point.y);
          }
        })
        this.ctx.stroke();

    })

    this.ctx.strokeStyle = this.penConfig.color;
    this.ctx.lineWidth = this.penConfig.width;
    this.ctx.beginPath();
    this.points.forEach((point, index) => {
      if(index === 0) {
        if(!this.ctx) { return; }
        this.ctx.moveTo(point.x, point.y);
      } else {
        if(!this.ctx) { return; }
        this.ctx.lineTo(point.x, point.y);
      }
    })
    this.ctx.stroke();

    if(this.isMouseDown) {
      this.points.push(this.mousePosition);
    }

    if(this.debugPoints){
      this.strokes.forEach(stroke => {
        stroke.points.forEach((point, index) => {
          if(index === 0) {
            this.drawRect(point.x, point.y, 5, 5);
          } else {
            this.drawRect(point.x, point.y, 3, 3);
          }
        })
      })
     }
  
     if(this.debugPoints){
      this.points.forEach((point, index) => {
        if(index === 0) {
          this.drawRect(point.x, point.y, 5, 5);
        } else {
          this.drawRect(point.x, point.y, 3, 3);
        }
      })
     }

  }

   private drawRect(x: number, y: number, width: number, height: number) {
     if(!this.ctx) { return; }
     this.ctx.fillStyle = 'blue';
     this.ctx.fillRect(x - ( width / 2 ),  y - ( height / 2 ), width, height);
   }

  private mouseMove(e: MouseEvent) {
    this.mousePosition = new Point(e.offsetX, e.offsetY);
    if(this.isMouseDown) {
      void this.redraw()
    }
  }

  private mouseDown() {
    this.isMouseDown = true;
    void this.redraw()
  }

  private mouseUp() {
    let points = this.points;

    this.config.pointsPipeline.forEach((fn) => {
      points = fn(points);
    })

    this.strokes.push(new Stroke(points, this.penConfig));
    this.points = [];

    this.isMouseDown = false;
    void this.redraw()
  }

  private resize() {
    this.canvas?.getBoundingClientRect();
    this.canvas?.setAttribute('width', `${this.canvas?.clientWidth}`);
    this.canvas?.setAttribute('height', `${this.canvas?.clientHeight}`);    
  }
}
