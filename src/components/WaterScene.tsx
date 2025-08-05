import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

const WaterScene = () => {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Add some gentle animation to the water surface
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group>
      {/* Water surface */}
      <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20, 32, 32]} />
        <meshStandardMaterial 
          color="#4A90E2" 
          transparent 
          opacity={0.8}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* Ocean floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Some underwater objects */}
      <mesh position={[-3, -1, -2]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      <mesh position={[3, -1.5, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
    </group>
  )
}

export default WaterScene 