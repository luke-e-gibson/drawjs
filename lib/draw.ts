export class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  
  }
}

export interface PenConfig {
  color: string;
  width: number;
}

export class Stroke {
  readonly points: Point[] = [];
  readonly config: PenConfig = {
    color: 'black',
    width: 1
  }

  constructor(points: Point[], color: PenConfig = {color: 'black', width: 1}) {
    this.points = points;
    this.config = color;
  }
}


export default class DrawHtml {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private penConfig: PenConfig = {
    color: 'black',
    width: 1
  }
 
  public get PenConfig() : PenConfig {
    return this.penConfig;
  }
  
  
  private mousePosition: Point = new Point(0, 0);
  private isMouseDown: boolean = false

  private points: Point[] = [];
  private strokes: Stroke[] = [];

  constructor() {
    this.canvas = document.getElementById('draw-canvas') as HTMLCanvasElement;
    if(!this.canvas) { throw new Error('Canvas not found'); }

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if(!this.ctx) { throw new Error('Canvas not found'); }


    this.canvas.addEventListener('resize', this.resize.bind(this));
    this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.mouseUp.bind(this));
  }

  public updatePenconfig(config: PenConfig) {
    this.penConfig = config;
  }

  private redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.strokes.forEach(stroke => {
        this.ctx.strokeStyle = stroke.config.color;
        this.ctx.lineWidth = stroke.config.width;

        this.ctx.beginPath();
        stroke.points.forEach((point, index) => {
          if(index === 0) {
            this.ctx.moveTo(point.x, point.y);
          } else {
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
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    })
    this.ctx.stroke();

    this.ctx.fillStyle = 'blue';
    this.drawRect(this.mousePosition.x, this.mousePosition.y, 10, 10);
    this.ctx.fillStyle = 'black';

    if(this.isMouseDown) {
      this.points.push(this.mousePosition);
    }

  }

  private drawRect(x: number, y: number, width: number, height: number) {
    this.ctx.fillRect(x - ( width / 2 ),  y - ( height / 2 ), width, height);
  }

  private mouseMove(e: MouseEvent) {
    this.mousePosition = new Point(e.offsetX, e.offsetY);
    void this.redraw()
  }

  private mouseDown() {
    this.isMouseDown = true;
    void this.redraw()

  }

  private mouseUp() {
    
    this.strokes.push(new Stroke(this.points, this.penConfig));
    this.points = [];

    this.isMouseDown = false;
    void this.redraw()
  }

  private resize() {
    console.log('resize');
    void this.redraw()    
  }
}
