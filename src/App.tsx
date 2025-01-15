import {Canvas, CanvasDebugButton, PenColorChanger, PenWidthChanger, useDrawjs} from '../lib/react'

function App() {

  useDrawjs()

  return (
    <>
      <div>
        <PenColorChanger/>
        <PenWidthChanger/>
        <CanvasDebugButton/>
        <Canvas width={800} height={800} style={{border: "black 1px solid"}}/>
      </div>
    </>
  )
}

export default App
