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