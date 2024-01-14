import { Canvas } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, Stats, useProgress } from "@react-three/drei"
import Lamborghini from "./components/Models/Lamborghini Aventador J"
import Scene from "./components/Models/Autobianchi Stellina"
import Maserati from "./components/Models/Maserati MC20"
import { Leva, levaStore, useControls, button } from 'leva'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Model, ModelProps, models } from './components/Models/model'

interface Cars {
  readonly Model: (props: ModelProps) => JSX.Element;
  readonly interior: string;
  readonly exterior: string;
}

export default function App() {
  const cars: Record<Model, Cars> = useMemo(() => ({
    "Lamborghini Aventador J": {
      Model: Lamborghini,
      interior: "#000000",
      exterior: "#9a9898",
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
  }), []);

  const [carsState, setCarsState] = useState(() => cars);
  const carsStateRef = useRef(carsState);

  useEffect(() => {
    carsStateRef.current = carsState;
  }, [carsState]);

  const resetCarColor = () => {
    const model = levaStore.get("Select") as Model;
    set({
      Exterior: cars[model].exterior,
      Interior: cars[model].interior,
    });
  };

  const setCarInterior = (interior: string) => {
    const model = levaStore.get("Select") as Model;
    setCarsState({
      ...carsStateRef.current,
      [model]: {
        ...carsStateRef.current[model],
        interior
      }
    })
  };

  const setCarExterior = (exterior: string) => {
    const model = levaStore.get("Select") as Model;
    setCarsState({
      ...carsStateRef.current,
      [model]: {
        ...carsStateRef.current[model],
        exterior
      }
    })
  };

  const [{ Rotation, Stats: stats }, set] = useControls(() => ({
    Select: {
      options: models,
      onChange: (value: Model) => {
        set({
          Exterior: carsStateRef.current[value].exterior,
          Interior: carsStateRef.current[value].interior,
        });
      }
    },
    Interior: {
      value: '#000000',
      onChange: setCarInterior
    },
    Exterior: {
      value: '#9a9898',
      onChange: setCarExterior
    },
    Rotation: false,
    Stats: true,
    "Reset color": button(resetCarColor),
  }));

  const { progress } = useProgress();

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10] }} shadows={true} frameloop="demand">
        <Suspense fallback={null}>
          {models
            .map(name => {
              const Model = cars[name].Model;
              return <Model exterior={carsState[name].exterior} interior={carsState[name].interior} visible={levaStore.get("Select") === name} key={name} />
            })}
        </Suspense>
        <Environment
          background
          files={'venice_sunset_1k.hdr'}
          blur={0.5}
        />
        {stats ? <Stats /> : undefined}
        <OrbitControls maxPolarAngle={7 * Math.PI / 18} autoRotate={Rotation} minDistance={2} maxDistance={15} />
      </Canvas>
      <Loader />
      <Leva
        hidden={progress === 100 ? false : true}
      />
    </>
  )
}