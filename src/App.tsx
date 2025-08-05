import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState } from 'react'
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
  const [placementMode, setPlacementMode] = useState(false)

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #87CEEB, #4682B4)',
      position: 'relative'
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

      {/* Simple UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#FFD700' }}>AquaForge</h3>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          {placementMode ? 'Placement Mode: Click to place objects' : 'Click "Place Object" to start building'}
        </p>
        <button 
          onClick={() => setPlacementMode(!placementMode)}
          style={{
            background: placementMode ? '#FF6B6B' : '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {placementMode ? 'Cancel Placement' : 'Place Object'}
        </button>
      </div>
    </div>
  )
}

export default App 