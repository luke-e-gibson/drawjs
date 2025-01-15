# Drawjs
React component to help you add drawing to your react project

#### Demo: [Drawjs Demo](https://drawjs.lukegibson.dev)

#### Features
 - Mouse/ track pad drawing
 - Pen options
    - Thickness
    - Color
 - Export as json or image
 - Smoothing brush strokes
 - Configurable


 ### Examples
 #### Basic Canvas 
 Creates a basic basic canvas you can draw on 
 ```jsx 
 import { DrawCanvas } from "@luke-e-gibson/drawjs"
 
 export function App() {
  return (
    <div>
      <DrawCanvas width={800} height={800}>
    </div>
  )
 }
 ````

#### Custom pen settings
Create a custom canvas that you draw on with a blue pen with a width of 5.
 ```jsx 
 import { DrawCanvas, useDrawjs } from "@luke-e-gibson/drawjs"
 
 export function App() {
  const drawjs = useDrawjs()
  const settings = {
    pen: {
      color: "blue"
      width: 5
    },
  }

  drawjs.setConfig(settings)

  return (
    <div>
      <DrawCanvas width={800} height={800}>
    </div>
  )
 }
 ```