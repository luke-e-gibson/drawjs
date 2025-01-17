import { Point } from "./templates";

export function simplifyPoints(points: Point[], tolerance: number = 1): Point[] {
  if (points.length < 3) return points;
  
  const result: Point[] = [points[0]];
  let lastPoint = points[0];
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = Math.sqrt(
      Math.pow(points[i].x - lastPoint.x, 2) + 
      Math.pow(points[i].y - lastPoint.y, 2)
    );
    
    if (distance >= tolerance) {
      result.push(points[i]);
      lastPoint = points[i];
    }
  }
  
  result.push(points[points.length - 1]);
  return result;
}