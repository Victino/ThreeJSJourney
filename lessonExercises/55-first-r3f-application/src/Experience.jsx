import { useThree, extend, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import CustomObject from './CustomObject.jsx'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
extend({ OrbitControls })

export default function Experience()
{
    useFrame((state, delta) =>
    {
        cubeRef.current.rotation.y += delta
        groupRef.current.rotation.y += delta
    })

    const cubeRef = useRef()
    const groupRef = useRef()
    const three = useThree()
    const { camera, gl } = useThree()

    return <>
    <orbitControls args={ [ camera, gl.domElement ] } />
    <directionalLight />
    <ambientLight intensity={ 1.5 } />
    
    <CustomObject />
    
<group ref={ groupRef }>
    <mesh position-x={ - 2 }>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
    </mesh>

    <mesh ref={ cubeRef } rotation-y={ Math.PI * 0.25 } position-x={ 2 } scale={ 1.5 }>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
    </mesh>
</group>

<mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
    <planeGeometry />
    <meshStandardMaterial color="greenyellow" />
</mesh>
    </>
}