import { Text, Html, ContactShadows, PresentationControls, Float, Environment, useGLTF } from '@react-three/drei'

export default function Experience()
{
    const computer = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf')
    return (
      <>
        <color args={["#241a1a"]} attach="background" />

        <Environment preset="city" />

        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float rotationIntensity={0.4}>
            <rectAreaLight
              width={2.5}
              height={1.65}
              intensity={65}
              color={"#0069ff"}
              rotation={[-0.1, Math.PI, 0]}
              position={[0, 0.55, -1.15]}
            />

            <primitive
              object={computer.scene}
              position-y={-1.2}
              rotation-x={0}
              rotation-y={-0.5}
              position-z={0.5}
              position-x={-0.5}
            
            >
              <Html
                transform
                wrapperClass="htmlScreen"
                distanceFactor={1.17}
                position={[0, 1.56, -1.4]}
                rotation-x={-0.256}
              >
                <iframe src="https://vitojak.vercel.app/" />
              </Html>
            </primitive>

            <Text
              font="./bangers-v20-latin-regular.woff"
              fontSize={1}
              position={[2, 0.75, 0.75]}
              rotation-y={-1.25}
              maxWidth={ 2 }
            >
            </Text>
          </Float>
        </PresentationControls>

        <ContactShadows position-y={-1.4} opacity={0.4} scale={5} blur={2.4} />
      </>
    );
}