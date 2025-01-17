import styles from "../style/style.module.css";
import React, { useEffect, useRef, useState } from "react";
import DrawHtml from "../core/core";

const DrawContext = React.createContext<DrawHtml | null>(null);

export function DrawProvider({ children }: { children: React.ReactNode }) {
  const [drawInstance] = useState(() => new DrawHtml());

  return (
    <DrawContext.Provider value={drawInstance}>{children}</DrawContext.Provider>
  );
}

export function useDrawjs() {
  const context = React.useContext(DrawContext);
  if (!context) {
    throw new Error("useDrawjs must be used within a DrawProvider");
  }
  return context;
}

export function Canvas(props: React.HTMLAttributes<HTMLDivElement>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvas = useRef<HTMLCanvasElement>(null);
  const draw = useDrawjs();

  useEffect(() => {
    if (canvasRef.current && backCanvas.current) {
      draw.attach(canvasRef.current, backCanvas.current);
    }
  }, [canvasRef, draw]);

  return (
    <div id={styles["drawjs-container"]} {...props}>
      <canvas  ref={canvasRef} id={styles["drawjs-front"]}/>
      <canvas ref={backCanvas} id={styles["drawjs-back"]}/>
    </div>
  );
}

export function PenColorChanger(props: React.HTMLAttributes<HTMLInputElement>) {
  const draw = useDrawjs();
  const [color, setColor] = useState(draw.penConfig.color);

  useEffect(() => {
    draw.setPenConfig({ width: draw.penConfig.width, color: color });
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
  const [width, setWidth] = useState(draw.penConfig.width);

  useEffect(() => {
    draw.setPenConfig({ width: width, color: draw.penConfig.color });
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
        console.log(draw.debugMode);
        draw.setDebugMode(!draw.debugMode);
      }}
      {...props}
    >
      Debug
    </button>
  );
}
