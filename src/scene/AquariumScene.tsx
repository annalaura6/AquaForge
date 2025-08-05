import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'
import WaterSystem from './WaterSystem'
import LightingSystem from './LightingSystem'

const AquariumScene = () => {
  const aquariumRef = useRef<Group>(null)
  const glassRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (glassRef.current) {
      // Subtle glass animation
      glassRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
    }
  })

  return (
    <group ref={aquariumRef}>
      {/* Glass Aquarium Container */}
      <mesh ref={glassRef} position={[0, 0, 0]}>
        <boxGeometry args={[15, 10, 8]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transparent
          opacity={0.1}
          metalness={0.9}
          roughness={0.1}
          ior={1.5}
          thickness={0.5}
        />
      </mesh>

      {/* Water System */}
      <WaterSystem />

      {/* Lighting System */}
      <LightingSystem />

      {/* Seafloor */}
      <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial 
          color="#D2B48C"
          roughness={0.8}
        />
      </mesh>

      {/* Back wall with gradient */}
      <mesh position={[0, 0, -4]} rotation={[0, 0, 0]}>
        <planeGeometry args={[15, 10]} />
        <meshStandardMaterial 
          color="#4682B4"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

export default AquariumScene 