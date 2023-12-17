import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from "@react-three/drei/web"

export default function App() {
  return (
    <React.Fragment>
      {/* <Canvas camera={{ position: [0, 0, 10] }} shadows={true} frameloop="demand">
        <Suspense fallback={null}>
        </Suspense>
      </Canvas>
      <Loader /> */}
      <h1 className="text-3xl font-bold underline">Hello World!</h1>
    </React.Fragment>
  )
}