import React, { Suspense } from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import { OrbitControls, ContactShadows } from 'drei'
import { proxy, } from 'valtio'
import Model from './Scene.js'
import * as THREE from 'three'
import './App.css'
import ColorPicker from './ColorPicker.js'

const state = proxy({
  current: null,
  items: {
    interior: '#FFF300',
    exterior: '#FFF000',
  }
})

function Ground(props) {
  const { scene } = useThree()
  scene.background = new THREE.Color(0xeeeeee)
  // scene.fog = new THREE.Fog(0xeeeeee, 10, 50)
  scene.background = new THREE.Color(0xffffff)
  const grid = new THREE.GridHelper(100, 40, 0x000000, 0x000000)
  grid.material.opacity = 0.3
  grid.material.depthWrite = true
  grid.material.transparent = false
  scene.add(grid)
  return null
}



function App() {
  return (
    <>
      <ColorPicker />
      <Canvas>
        <ambientLight intensity={1} />
        <spotLight intensity={1} angle={0.1} penumbra={0} position={[0, 50, 0]} />
        <pointLight intensity={1} position={[40, 0, 0]} />
        <pointLight intensity={1} position={[-40, 0, 0]} />
        <pointLight intensity={1} position={[0, 0, 40]} />
        <Suspense fallback={null}>
          <Model />
          <Ground />
          <ContactShadows rotation-x={Math.PI / 2} position={[0, -0.8, 0]} opacity={0.25} width={10} height={10} blur={2} far={1} />
        </Suspense>
        <OrbitControls maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </>
  )
}

export { state, App }