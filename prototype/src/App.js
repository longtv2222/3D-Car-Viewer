import React, { Suspense, useState } from 'react'
import { Canvas, useThree, useLoader } from 'react-three-fiber'
import { OrbitControls, PerspectiveCamera } from 'drei'
import { Model } from './Scene.jsx'
import * as THREE from 'three'
import './App.css'
import ColorPicker from './ColorPicker.jsx'
import { TextureLoader } from 'three'
import { Larmborghini } from './Lamborghini.jsx'
import { proxy } from 'valtio'


function Environment() {
  const { scene, gl } = useThree()
  const texture = useLoader(TextureLoader, 'venice_sunset.jpg')
  let pmremGenerator = new THREE.PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();
  let envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.environment = envMap;
  // scene.background = envMap;

  return null
}

function Ground() {
  const { scene } = useThree()
  scene.background = new THREE.Color(0xeeeeee)
  scene.background = new THREE.Color(0xffffff)
  const grid = new THREE.GridHelper(100, 40, 0x000000, 0x000000)
  grid.material.opacity = 0.3
  grid.material.depthWrite = true
  grid.material.transparent = false
  grid.receiveShadow = true

  scene.add(grid)

  return null
}

const state = proxy({
  current: null,
  items: {
    interior: '#FFF300',
    exterior: '#FFF000',
  }
})

function App() {
  const [visible, setModel] = useState(false)

  return (
    <>
      <ColorPicker passedFunction={() => setModel(!visible)} />
      <Canvas>
        <Suspense fallback={null}>
          <Environment />
          <Ground />
          <Model visibility={!visible} myState={state} />
          <Larmborghini visibility={visible} myState={state}/>
          <OrbitControls maxPolarAngle={7 * Math.PI / 18} />
        </Suspense>
      </Canvas>
    </>
  )
}

export { App, state }