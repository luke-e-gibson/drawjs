import React, { useEffect, useRef, useState } from "react";
import DrawHtml from "./lib";

const draw = new DrawHtml();

export function useDrawjs() {
  return draw;
}

export function Canvas(props: React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = useDrawjs();

  console.log("canvas", canvasRef.current);

  useEffect(() => {
    if (canvasRef.current) {
      draw.attach(canvasRef.current);
    }
  }, [canvasRef, draw]);

  return <canvas ref={canvasRef} {...props} />;
}

export function PenColorChanger(props: React.HTMLAttributes<HTMLInputElement>) {
  const draw = useDrawjs();
  const [color, setColor] = useState(draw.PenConfig.color);

  useEffect(() => {
    draw.updatePenConfig({ width: draw.PenConfig.width, color: color });
  }, [color, draw]);

  return (
    <input
      type="color"
      onChange={(e) => {
        setColor(e.target.value);
      }}
      {...props}
    />
  );
}

export function PenWidthChanger(props: React.HTMLAttributes<HTMLInputElement>) {
  const draw = useDrawjs();
  const [width, setWidth] = useState(draw.PenConfig.width);

  useEffect(() => {
    draw.updatePenConfig({ width: width, color: draw.PenConfig.color });
  }, [width, draw]);

  return (
    <input
      type="number"
      value={width}
      onChange={(e) => {
        setWidth(Number(e.target.value));
      }}
      {...props}
    />
  );
}

export function CanvasDebugButton(
  props: React.HTMLAttributes<HTMLButtonElement>
) {
  const draw = useDrawjs();

  return (
    <button
      onClick={() => {
        draw.toggleDebugPoints();
      }}
      {...props}
    >
      Debug
    </button>
  );
}
