import { Canvas } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, Stats, useProgress } from "@react-three/drei"
import Lamborghini from "./components/Models/Lamborghini"
import Scene from "./components/Models/Autobianchi Stellina"
import Maserati from "./components/Models/Maserati_mc20"
import { Leva, levaStore, useControls, button } from 'leva'
import { Suspense } from 'react'
import { Model } from './components/Models/model'

export default function App() {
  const carNameComponentMap: Record<string, {
    readonly interior: string,
    readonly exterior: string,
    readonly Model: (props: Model) => JSX.Element,
  }> = {
    "Lamborghini Aventador J": {
      Model: Lamborghini,
      interior: "#000000",
      exterior: "#9a9898"
    },
    "Maserati MC20": {
      Model: Maserati,
      interior: "#000000",
      exterior: "#ffffff"
    },
    "Autobianchi Stellina": {
      Model: Scene,
      interior: "#000000",
      exterior: "#963f3f"
    },
  };

  const resetCarColor = () => {
    const model: string = levaStore.get("Select");
    set({
      Exterior: carNameComponentMap[model]?.exterior,
      Interior: carNameComponentMap[model]?.interior,
    });
  };

  const [{ Interior, Exterior, Rotation, Select, Stats: stats }, set] = useControls(() => ({
    Select: { 
      options: Object.keys(carNameComponentMap),
      onChange:(value)=>{
        set({
          Exterior: carNameComponentMap[value]?.exterior,
          Interior: carNameComponentMap[value]?.interior,
        });
      }
    },
    Interior: '#000000',
    Exterior: '#9a9898',
    Rotation: false,
    Stats: true,
    "Reset Color": button(resetCarColor),
  }));

  const { progress } = useProgress()

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10] }} shadows={true} frameloop="demand">
        <Suspense fallback={null}>
          {Object.entries(carNameComponentMap)
            .map(([name, car]) => (
              car.Model({
                exterior: Exterior,
                interior: Interior,
                visible: levaStore.get("Select") === name,
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