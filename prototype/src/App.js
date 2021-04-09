import React, { Suspense } from 'react'
import { Canvas, useThree, useLoader } from 'react-three-fiber'
import { OrbitControls, ContactShadows } from 'drei'
import { proxy, } from 'valtio'
import Model from './Scene.js'
import * as THREE from 'three'
import './App.css'
import ColorPicker from './ColorPicker.js'
import { TextureLoader } from 'three'

const state = proxy({
  current: null,
  items: {
    interior: '#FFF300',
    exterior: '#FFF000',
  }
})

function Environment() {
  const { scene, gl } = useThree()
  const texture = useLoader(TextureLoader, 'venice_sunset.jpg')
  let pmremGenerator = new THREE.PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();
  let envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.environment = envMap;
  scene.background = envMap
  return null
}

function Ground(props) {
  const { scene } = useThree()
  scene.background = new THREE.Color(0xeeeeee)
  scene.fog = new THREE.Fog(0xeeeeee, 10, 50)
  scene.background = new THREE.Color(0xffffff)
  const grid = new THREE.GridHelper(100, 40, 0x000000, 0x000000)
  grid.material.opacity = 0.3
  grid.material.depthWrite = true
  grid.material.transparent = false
  grid.receiveShadow = true

  scene.add(grid)

  return null
}



function App() {
  return (
    <>
      <ColorPicker />
      <Canvas>
        <Suspense fallback={null}>
          <Environment />
          <Ground />
          <Model />
          <OrbitControls maxPolarAngle={Math.PI / 2} />
        </Suspense>
      </Canvas>
    </>
  )
}

export { state, App }