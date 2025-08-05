import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

// Separate component for animated water
const AnimatedWater = () => {
  const waterRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (waterRef.current) {
      // Animated water surface with gentle waves
      const time = state.clock.elapsedTime
      waterRef.current.position.y = 3 + Math.sin(time * 0.5) * 0.05
      waterRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 0.3) * 0.02
    }
  })

  return (
    <mesh ref={waterRef} position={[0, 3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[7, 3, 32, 32]} />
      <meshPhysicalMaterial 
        color="#4A90E2"
        transparent
        opacity={0.4}
        metalness={0.1}
        roughness={0.2}
        ior={1.33}
      />
    </mesh>
  )
}

function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #87CEEB, #4682B4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px'
    }}>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.4} color="#4A90E2" />
        <directionalLight position={[5, 10, 5]} intensity={0.8} color="#FFD700" />
        
        {/* Glass Aquarium Container */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8, 6, 4]} />
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
        
        {/* Animated Water Surface */}
        <AnimatedWater />
        
        {/* Seafloor */}
        <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7, 3]} />
          <meshStandardMaterial 
            color="#D2B48C"
            roughness={0.8}
          />
        </mesh>
        
        {/* Test cube inside aquarium */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App 