import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { DrawProvider } from "../lib/react/react.tsx";
import { createCanvas } from "../lib/vanilla/vanilla.ts";

type TestMode = "react" | "vanilla";
const testMode: TestMode = "vanilla"

if(testMode === "react" as TestMode) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <DrawProvider>
        <App />
      </DrawProvider>
    </StrictMode>
  ); 
} else {
  const root = document.getElementById("root")!;
  root.style.width = "800px";
  root.style.height = "800px";
  root.style.border = "1px solid black";
  createCanvas(root);
}
