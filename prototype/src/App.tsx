import { Canvas } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, Stats, useProgress } from "@react-three/drei"
import Lamborghini from "./components/Models/Lamborghini"
import Scene from "./components/Models/Autobianchi Stellina"
import Maserati from "./components/Models/Maserati_mc20"
import { Leva, useControls } from 'leva'
import { Suspense } from 'react'

export default function App() {
  const carNameComponentMap = {
    "Lamborghini Aventador J": Lamborghini,
    "Maserati MC20": Maserati,
    "Autobianchi Stellina": Scene
  };

  const { Interior, Exterior, Rotation, Select, Stats: stats } = useControls({
    Select: { options: Object.keys(carNameComponentMap) },
    Interior: '#000000',
    Exterior: '#9a9898',
    Rotation: false,
    Stats: true,
  });

  const { progress } = useProgress()

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10] }} shadows={true} frameloop="demand">
        <Suspense fallback={null}>
          {Object.entries(carNameComponentMap)
            .map(([name, CarModel]) => (
              CarModel({
                exterior: Exterior,
                interior: Interior,
                visible: Select === name,
              })
            ))}
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