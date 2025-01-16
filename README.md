# Drawjs
React component to help you add drawing to your react project

#### Demo: [Drawjs Demo](https://drawjs.lukegibson.dev)

#### Features
 - Mouse, Pen, Touch pad drawing
 - Pen options
    - Thickness
    - Color
 - Export as json or image

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