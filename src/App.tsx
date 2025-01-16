import { useEffect } from "react";
import {
  Canvas,
  CanvasDebugButton,
  PenColorChanger,
  PenWidthChanger,
} from "../lib/react";

function App() {

  return (
    <>
      <div>
        <PenColorChanger />
        <PenWidthChanger />
        <CanvasDebugButton />
        { "Pen mode " + penMode}
        <Canvas
          width={800}
          height={800}
          style={{ border: "black 1px solid" }}
        />
      </div>
    </>
  );
}

export default App;
