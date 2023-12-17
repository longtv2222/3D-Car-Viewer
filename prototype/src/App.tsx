import { Canvas } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, Stats, useProgress } from "@react-three/drei"
import Lamborghini from "./components/Models/Lamborghini"
import Scene from "./components/Models/Scene"
import { Leva, useControls } from 'leva'
import { Suspense } from 'react'

export default function App() {
  const { Interior, Exterior, Rotation, Select, Stats: stats } = useControls({
    Select: { options: ['Lamborghini', 'Scene'] },
    Interior: '#aa5252',
    Exterior: '#9a9898',
    Rotation: false,
    Stats: true,
  });
  const { progress } = useProgress()

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10] }} shadows={true} frameloop="demand">
        <Suspense fallback={null}>
          <Lamborghini interior={Interior} exterior={Exterior} visible={Select === "Lamborghini"} />
          <Scene interior={Interior} exterior={Exterior} visible={Select === "Scene"} />
        </Suspense>
        <Environment
          background
          files={'venice_sunset_1k.hdr'}
          blur={0.5}
        />
        {stats ? <Stats /> : undefined}
        <OrbitControls maxPolarAngle={7 * Math.PI / 18} maxDistance={20} autoRotate={Rotation} />
      </Canvas>
      <Loader />
      <Leva
        hidden={progress === 100 ? false : true}
      />
    </>
  )
}