import { Canvas } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, Stats } from "@react-three/drei"
import Lamborghini from "./components/Models/Lamborghini"
import { useControls } from 'leva'

export default function App() {
  const { Interior, Exterior, rotation, hideStats, select } = useControls({
    select: { options: ['Lamborghini', 'Scene'] },
    rotation: false,
    hideStats: false,
    Interior: '#aa5252',
    Exterior: '#9a9898'
  });
  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 0, 10] }} shadows={true} frameloop="demand">
        <Environment
          background
          files={'venice_sunset_1k.hdr'}
          blur={0.5}
        />
        {!hideStats ? <Stats /> : undefined}
        {select === "Lamborghini" && <Lamborghini interior={Interior} exterior={Exterior} />}
        <OrbitControls maxPolarAngle={7 * Math.PI / 18} maxDistance={20} autoRotate={rotation} />
      </Canvas>
      <Loader />
    </div>
  )
}