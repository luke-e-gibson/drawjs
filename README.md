# Finelinerjs
A easy to use drawing library to embed in to your app. [Demo](https://finelinerjs.lukegibson.dev)



## Getting started
Install: ```npm install finelinerjs ```

#### React
``` tsx 
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
```


#### Plan html and javascript

```js
const root = document.getElementById("root");
root.style.width = "800px";
root.style.height = "800px";
root.style.border = "1px solid black";
createCanvas(root); 
```