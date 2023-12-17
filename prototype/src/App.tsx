import { Canvas } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, Stats } from "@react-three/drei"
import Lamborghini from "./components/Models/Lamborghini"
import Scene from "./components/Models/Scene"
import { useControls } from 'leva'
import { Suspense } from 'react'

export default function App() {
  const { Interior, Exterior, rotation, hideStats, select } = useControls({
    select: { options: ['Lamborghini', 'Scene'] },
    Interior: '#aa5252',
    Exterior: '#9a9898',
    rotation: false,
    hideStats: false,
  });

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10] }} shadows={true} frameloop="demand">
        <Suspense fallback={null}>
          {select === "Lamborghini" && <Lamborghini interior={Interior} exterior={Exterior} />}
          {select === "Scene" && <Scene interior={Interior} exterior={Exterior} />}
        </Suspense>
        <Environment
          background
          files={'venice_sunset_1k.hdr'}
          blur={0.5}
        />
        {!hideStats ? <Stats /> : undefined}
        <OrbitControls maxPolarAngle={7 * Math.PI / 18} maxDistance={20} autoRotate={rotation} />
      </Canvas>
      <Loader />
    </>
  )
}