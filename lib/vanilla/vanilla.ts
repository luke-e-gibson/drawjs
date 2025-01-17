import FinelinerCore from "../core/core";
import style from "../style/style.module.css";

export function createCanvas(parent: HTMLElement) {
  const container = document.createElement("div");
  const frontCanvas = document.createElement("canvas") as HTMLCanvasElement;
  const backCanvas = document.createElement("canvas") as HTMLCanvasElement;

  container.id = style["drawjs-container"];
  frontCanvas.id = style["drawjs-front"]
  backCanvas.id = style["drawjs-back"]

  container.appendChild(frontCanvas);
  container.appendChild(backCanvas);

  parent.appendChild(container);

  const finelinerInstance = new FinelinerCore()
  finelinerInstance.attach(frontCanvas, backCanvas);

  return finelinerInstance;
}