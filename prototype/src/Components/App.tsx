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
  return null;
}

function Ground() {
  return <gridHelper args={[100, 40, 0x000000, 0x000000]} receiveShadow={true}>
    <meshStandardMaterial opacity={0.3} depthWrite={true} />
  </gridHelper>
}


const state = proxy({
  current: null,
  items: {
    interior: '',
    exterior: '',
  }
})



function App() {

  const arr = ['Scene', 'Lamborghini'];
  let [index, setModel] = useState(0);
  return (
    <>
      <ColorPicker passedFunction={() => setModel(() => {
        state.items.interior = '';  //Clear color selection
        state.items.exterior = '';
        return (++index) === arr.length ? 0 : index
      })} />
      <Canvas>
        <Suspense fallback={null}>
          <Environment />
          <Ground />
          {/*// @ts-ignore */}
          <Model visibility={arr[index]} myState={state} />
          {/*// @ts-ignore */}
          <Larmborghini visibility={arr[index]} myState={state} />
          <OrbitControls maxPolarAngle={7 * Math.PI / 18} />
        </Suspense>
      </Canvas>
    </>
  )
}

export { App, state }