import { useEffect } from "react";
import {
  Canvas,
  CanvasDebugButton,
  PenColorChanger,
  PenWidthChanger,
} from "../lib/react/react";

function App() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <PenColorChanger />
          <PenWidthChanger />
          <CanvasDebugButton />
        </div>
        <Canvas
          style={{ border: "black 1px solid", width: "50%", height: "800px" }}
        />
      </div>
    </>
  );
}

export default App;
