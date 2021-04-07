import React, { useRef, Suspense } from 'react'
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import { useGLTF, OrbitControls, ContactShadows } from 'drei'
import { proxy, useProxy } from 'valtio'
import * as THREE from 'three'

const state = proxy({
  current: null,
  items: {
    interior: '#DC143C',
    exterior: '#FF3333'
  }
})

function Ground(props) {
  const { scene } = useThree()
  scene.background = new THREE.Color(0xeeeeee)
  scene.fog = new THREE.Fog(0xeeeeee, 10, 50)
  scene.background = new THREE.Color(0xffffff)
  scene.fog = new THREE.Fog(0xeeeeee, 10, 50)
  const grid = new THREE.GridHelper(100, 40, 0x000000, 0x000000)
  grid.material.opacity = 0.3
  grid.material.depthWrite = true
  grid.material.transparent = true
  scene.add(grid)
  return null
}

function Model(props) {
  // Update the cubeCamera with current renderer and scene.
  const group = useRef()

  const snap = useProxy(state)
  const { nodes, materials } = useGLTF('dodge-challenger_moasdfdel.glb')
  return (
    <group position={[0, 0.7, 0]} ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Body002.geometry} material={materials.license_plate} />
      <group position={[0.88, -0.33, -1.59]}>
        <mesh geometry={nodes.Cylinder009.geometry} material={materials.tire} />
        <mesh geometry={nodes.Cylinder009_1.geometry} material={materials.rim} />
      </group>
      <group position={[0.88, -0.33, 1.47]}>
        <mesh geometry={nodes.Cylinder010.geometry} material={materials.tire} />
        <mesh geometry={nodes.Cylinder010_1.geometry} material={materials.rim} />
      </group>
      <group position={[-0.88, -0.33, 1.47]}>
        <mesh geometry={nodes.Cylinder008.geometry} material={materials.tire} />
        <mesh geometry={nodes.Cylinder008_1.geometry} material={materials.rim} />
      </group>
      <group position={[-0.88, -0.33, -1.59]}>
        <mesh geometry={nodes.Cylinder.geometry} material={materials.tire} />
        <mesh geometry={nodes.Cylinder_1.geometry} material={materials.rim} />
      </group>
      <mesh geometry={nodes.Plane_1.geometry} material={materials.body_mat} />
      <mesh geometry={nodes.Plane_2.geometry} material={materials.chrome} />
      <mesh geometry={nodes.Plane_3.geometry} material={materials.essence_cap} />
      <mesh geometry={nodes.Plane_4.geometry} material={materials.exhaust} />
      <mesh geometry={nodes.Plane_5.geometry} material={materials.blinkers} />
      <mesh geometry={nodes.Chassis.geometry} material={materials.chassis}>
        <mesh geometry={nodes.BrakeDisk0.geometry} material={materials.brake_disk} position={[-0.88, -0.33, -1.59]} />
        <mesh geometry={nodes.BrakeDisk1.geometry} material={materials.brake_disk} position={[0.88, -0.33, -1.59]} />
        <mesh geometry={nodes.BrakeDisk2.geometry} material={materials.brake_disk} position={[-0.88, -0.33, 1.47]} />
        <mesh geometry={nodes.BrakeDisk3.geometry} material={materials.brake_disk} position={[0.88, -0.33, 1.47]} />
      </mesh>
      <mesh geometry={nodes.Plane002.geometry} material={materials.glass_mat} />
      <mesh geometry={nodes.Plane002_1.geometry} material={materials['Black glass']} />
      <mesh geometry={nodes.Plane002_2.geometry} material={materials.chrome_window} />
      <mesh material-color={snap.items.interior} geometry={nodes.Interior.geometry} material={materials.interior} />
      <mesh geometry={nodes.Plane007.geometry} material={materials.rear_light} />
      <mesh geometry={nodes.Plane007_1.geometry} material={materials.logo1} />
      <mesh geometry={nodes.Plane006.geometry} material={materials.roller} />
      <mesh geometry={nodes.Plane006_1.geometry} material={materials.chrome_roller} />
      <mesh geometry={nodes.Plane006_2.geometry} material={materials.logo2} />
      <mesh geometry={nodes.Plane006_3.geometry} material={materials.logo3} />
      <mesh material-color={snap.items.exterior} geometry={nodes.Body.geometry} material={materials.CarPaint} />
    </group>
  )
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.3} angle={0.1} penumbra={1} position={[5, 25, 20]} />
      <Suspense fallback={null}>
        <Model />
        <Ground />
        <ContactShadows rotation-x={Math.PI / 2} position={[0, -0.8, 0]} opacity={0.25} width={10} height={10} blur={2} far={1} />
      </Suspense>
      <OrbitControls maxPolarAngle={Math.PI / 2} />
    </Canvas>
  )
}
