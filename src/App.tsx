import {Canvas, CanvasDebugButton, PenColorChanger, PenWidthChanger, TogglePenModeButton, useDrawjs} from '../lib/react'

function App() {

  useDrawjs()

  return (
    <>
      <div>
        <PenColorChanger/>
        <PenWidthChanger/>
        <CanvasDebugButton/>
        <TogglePenModeButton/>
        <Canvas width={800} height={800} style={{border: "black 1px solid"}}/>
      </div>
    </>
  )
}

export default App
