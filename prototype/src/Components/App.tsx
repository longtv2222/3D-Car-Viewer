import { Suspense, useState } from 'react'
import { Canvas, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Model from '../Models/Scene'
import * as THREE from 'three'
import '../App.css'
import ColorPicker from './ColorPicker'
import { TextureLoader } from 'three'
import Larmborghini from '../Models/Lamborghini'
import { proxy } from 'valtio'


function Environment() {
  const { scene, gl } = useThree();
  const texture = useLoader(TextureLoader, 'venice_sunset.jpg');
  const pmremGenerator = new THREE.PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.environment = envMap;
  return <gridHelper args={[100, 40, 0x000000, 0x000000]} receiveShadow={true}>
    <meshStandardMaterial opacity={0.3} depthWrite={true} />
  </gridHelper>
}

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
  return (
    <>
      <ColorPicker passedFunction={() => setModel(() => {
        state.items.interior = '';  //Clear color selection
        state.items.exterior = '';
        index = ++index === state.cars.length ? 0 : index;
        state.current = index;
        return index;
      })} />
      <Canvas >
        <Suspense fallback={null}>
          <Environment />
          <Model myState={state} />
          <Larmborghini myState={state} />
          <OrbitControls maxPolarAngle={7 * Math.PI / 18} />
        </Suspense>
      </Canvas>
    </>
  )
}

export { App, state }