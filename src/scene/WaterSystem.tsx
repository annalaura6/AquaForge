import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

const WaterSystem = () => {
  const waterSurfaceRef = useRef<Mesh>(null)
  const bubbleRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (waterSurfaceRef.current) {
      // Animated water surface with gentle waves
      const time = state.clock.elapsedTime
      waterSurfaceRef.current.position.y = Math.sin(time * 0.5) * 0.1
      waterSurfaceRef.current.rotation.x = Math.sin(time * 0.3) * 0.05
    }

    if (bubbleRef.current) {
      // Floating bubble animation
      bubbleRef.current.position.y += 0.02
      if (bubbleRef.current.position.y > 5) {
        bubbleRef.current.position.y = -4
      }
    }
  })

  return (
    <group>
      {/* Water Surface */}
      <mesh ref={waterSurfaceRef} position={[0, 4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 7, 32, 32]} />
        <meshPhysicalMaterial 
          color="#4A90E2"
          transparent
          opacity={0.6}
          metalness={0.1}
          roughness={0.2}
          ior={1.33}
        />
      </mesh>

      {/* Floating Bubble */}
      <mesh ref={bubbleRef} position={[2, -4, 1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transparent
          opacity={0.8}
          metalness={0.9}
          roughness={0.1}
          ior={1.33}
        />
      </mesh>

      {/* Additional bubbles */}
      <mesh position={[-1, -3, -2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transparent
          opacity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[3, -2, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transparent
          opacity={0.7}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}

export default WaterSystem 