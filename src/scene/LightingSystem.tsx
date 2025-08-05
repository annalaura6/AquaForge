import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DirectionalLight } from 'three'

const LightingSystem = () => {
  const directionalLightRef = useRef<DirectionalLight>(null)

  useFrame((state) => {
    if (directionalLightRef.current) {
      // Subtle light movement to simulate underwater caustics
      const time = state.clock.elapsedTime
      directionalLightRef.current.position.x = Math.sin(time * 0.2) * 2
      directionalLightRef.current.position.z = Math.cos(time * 0.3) * 2
    }
  })

  return (
    <group>
      {/* Ambient lighting for overall illumination */}
      <ambientLight intensity={0.4} color="#4A90E2" />
      
      {/* Main directional light simulating sun through water */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 10, 5]}
        intensity={0.8}
        color="#FFD700"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Secondary fill light */}
      <directionalLight
        position={[-5, 8, -5]}
        intensity={0.3}
        color="#87CEEB"
      />

      {/* Underwater caustic effect light */}
      <pointLight
        position={[0, 3, 0]}
        intensity={0.2}
        color="#00BFFF"
        distance={15}
      />
    </group>
  )
}

export default LightingSystem 