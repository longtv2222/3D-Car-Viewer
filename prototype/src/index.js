import ReactDOM from 'react-dom'
import React from 'react'
import { Canvas } from 'react-three-fiber'
import App from './App'

ReactDOM.render(
  <Canvas>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <App position={[-1.2, 0, 0]} />
    <App position={[1.2, 0, 0]} />
  </Canvas>,
  document.getElementById('root')
)



