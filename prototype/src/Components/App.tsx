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
import { Loader, Sky } from "@react-three/drei/web"


/**
 * For configuring the environment
 */
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
  const [rotate, setRotate] = useState(true);
  return (
    <>
      <ColorPicker passedFunction={() => setModel(() => {
        state.items.interior = '';  //Clear color selection
        state.items.exterior = '';
        index = ++index === state.cars.length ? 0 : index;
        state.current = index;
        return index;
      })} enableRotate={() => setRotate(!rotate)} />
      <Canvas camera={{ position: [0, 0, 10] }}>
        <fog attach="fog" args={["white", 0, 100]} />
        <Sky sunPosition={[7, 5, 1]} />
        <Suspense fallback={null}>
          <Environment />
          <Model myState={state} />
          <Larmborghini myState={state} />
          <OrbitControls maxPolarAngle={7 * Math.PI / 18} maxDistance={50} autoRotate={rotate} />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  )
}

export { App, state }