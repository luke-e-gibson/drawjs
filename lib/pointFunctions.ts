import { Point } from "./helpers";

export const DrawJsPointFunctions = {
    smoothPoints(points: Point[], tension: number = 0.3): Point[] {
      if (points.length < 3) return points;
  
      const smoothed: Point[] = [];
      
      smoothed.push(points[0]);
  
  
      for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const current = points[i];
        const next = points[i + 1];
  
        const x = current.x + (next.x - prev.x) * tension;
        const y = current.y + (next.y - prev.y) * tension;
  
        smoothed.push(new Point(x, y));
      }
  
      smoothed.push(points[points.length - 1]);
  
      return smoothed;
    },
    distributePoints(points: Point[]): Point[] {
      const numberOfPoints = points.length / 2;
      if (points.length < 2) return points;
  
      const totalDistance = points.reduce((acc, point, i) => {
        if (i === 0) return 0;
        const prev = points[i - 1];
        return acc + Math.sqrt(Math.pow(point.x - prev.x, 2) + Math.pow(point.y - prev.y, 2));
      }, 0);
  
      const segmentLength = totalDistance / (numberOfPoints - 1);
      const result: Point[] = [points[0]];
      let currentDistance = 0;
      let currentIndex = 0;
  
      for (let i = 1; i < numberOfPoints - 1; i++) {
        const targetDistance = i * segmentLength;
  
        while (currentIndex < points.length - 1) {
          const p0 = points[currentIndex];
          const p1 = points[currentIndex + 1];
          const segDist = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
          
          if (currentDistance + segDist >= targetDistance) {
            const t = (targetDistance - currentDistance) / segDist;
            const x = p0.x + t * (p1.x - p0.x);
            const y = p0.y + t * (p1.y - p0.y);
            result.push(new Point(x, y));
            break;
          }
          
          currentDistance += segDist;
          currentIndex++;
        }
      }
  
      result.push(points[points.length - 1]);
      return result;
    }
  
}