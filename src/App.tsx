import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

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
        
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App 