import React, { useEffect, useRef } from "react";
import DrawHtml from "./lib";

export function useDrawCanvas() {
  const draw = useRef<DrawHtml | null>(null);

  if (!draw.current) {
    draw.current = new DrawHtml();
  }

  return draw.current;
}


export function DrawCanvas(props: React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = useDrawCanvas();

  console.log('canvas', canvasRef.current);

  useEffect(() => {
    if (canvasRef.current) {
      draw.attatch(canvasRef.current);
    }
  }, [canvasRef, draw])

  return (
    <div>
        <canvas ref={canvasRef} {...props} />
    </div>
  );
}