import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Model from './Models/Scene'
import './App.css'
import ColorPicker from './Components/ColorPicker'
import Larmborghini from './Models/Lamborghini'
import { proxy } from 'valtio'
import { Loader, Environment } from "@react-three/drei/web"

export interface CarProps {
  current: number,
  cars: Array<String>,
  items: {
    interior: string,
    exterior: string
  }
}

const state: CarProps = proxy({
  current: 0,
  cars: ['Scene', 'Lamborghini'],
  items: {
    interior: '',
    exterior: '',
  }
})

function App() {
  let [index, setModel] = useState(0);
  const [rotate, setRotate] = useState(true);
  return (
    <React.Fragment>
      <ColorPicker passedFunction={() => setModel(() => {
        state.items.interior = '';  //Clear color selection
        state.items.exterior = '';
        index = ++index === state.cars.length ? 0 : index;
        state.current = index;
        return index;
      })} enableRotate={() => setRotate(!rotate)} />
      <Canvas camera={{ position: [0, 0, 10] }} shadows={true} frameloop="demand">
        <Suspense fallback={null}>
          <Environment background={true}
            files={'venice_sunset_1k.hdr'}
            scene={undefined} />
          <Model myState={state} />
          <Larmborghini myState={state} />
          <OrbitControls maxPolarAngle={7 * Math.PI / 18} maxDistance={20} autoRotate={rotate} />

        </Suspense>
      </Canvas>
      <Loader />
    </React.Fragment>
  )
}

export { App, state }