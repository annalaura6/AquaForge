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

// Component for placed objects
const PlacedObject = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function App() {
  const [placedObjects, setPlacedObjects] = useState<Array<{ id: number, position: [number, number, number], color: string }>>([])
  const [objectCounter, setObjectCounter] = useState(0)
  const [selectedObject, setSelectedObject] = useState('🪨')
  const [ambientLight, setAmbientLight] = useState(60)
  const [sunIntensity, setSunIntensity] = useState(80)
  const [bubbleDensity, setBubbleDensity] = useState(40)
  const [currentStrength, setCurrentStrength] = useState(30)
  const [schoolSize, setSchoolSize] = useState(15)
  const [swimmingSpeed, setSwimmingSpeed] = useState(5)

  const handlePlaceObject = () => {
    // Create a new cube at a random position on the seafloor
    const randomX = (Math.random() - 0.5) * 6 // -3 to 3
    const randomZ = (Math.random() - 0.5) * 2 // -1 to 1
    const position: [number, number, number] = [randomX, -2.25, randomZ] // Just above seafloor
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`
    
    const newObject = {
      id: objectCounter,
      position,
      color
    }
    
    setPlacedObjects(prev => [...prev, newObject])
    setObjectCounter(prev => prev + 1)
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #2d4059 100%)',
      position: 'relative',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      color: '#e0e6ed',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'linear-gradient(90deg, rgba(15, 20, 25, 0.95) 0%, rgba(26, 35, 50, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 165, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(45deg, #ff7043, #ffa726)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#0f1419'
          }}>
            🔱
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #64b5f6, #42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AquaForge
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
          {['💾 Save', '📁 Load', '📸 Screenshot', '🔄 Reset'].map((text, index) => (
            <button key={index} style={{
              padding: '8px 16px',
              background: 'rgba(100, 181, 246, 0.1)',
              border: '1px solid rgba(100, 181, 246, 0.3)',
              borderRadius: '6px',
              color: '#64b5f6',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Object Palette */}
      <div style={{
        position: 'absolute',
        left: '20px',
        top: '80px',
        width: '80px',
        background: 'rgba(15, 20, 25, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 165, 0, 0.2)',
        borderRadius: '12px',
        padding: '15px 10px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#ffa726',
          textAlign: 'center',
          marginBottom: '15px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Objects
        </div>
        {['🪨', '🪸', '🌿', '🏰', '⚓', '🐚'].map((emoji, index) => (
          <div
            key={index}
            onClick={() => setSelectedObject(emoji)}
            style={{
              width: '60px',
              height: '60px',
              margin: '8px 0',
              background: selectedObject === emoji 
                ? 'linear-gradient(135deg, rgba(255, 167, 38, 0.2), rgba(255, 112, 67, 0.2))'
                : 'linear-gradient(135deg, rgba(45, 64, 89, 0.8), rgba(26, 35, 50, 0.8))',
              border: `2px solid ${selectedObject === emoji ? '#ffa726' : 'rgba(100, 181, 246, 0.3)'}`,
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: selectedObject === emoji ? '0 0 15px rgba(255, 167, 38, 0.5)' : 'none'
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Controls Panel */}
      <div style={{
        position: 'absolute',
        right: '20px',
        top: '80px',
        width: '280px',
        background: 'rgba(15, 20, 25, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 165, 0, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Lighting Section */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            color: '#ffa726',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            💡 Lighting
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              color: '#b0bec5',
              fontSize: '12px',
              marginBottom: '6px',
              display: 'block'
            }}>
              Ambient Light
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={ambientLight}
              onChange={(e) => setAmbientLight(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                background: `linear-gradient(to right, #64b5f6 0%, #64b5f6 ${ambientLight}%, rgba(45, 64, 89, 0.5) ${ambientLight}%, rgba(45, 64, 89, 0.5) 100%)`,
                borderRadius: '3px',
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              color: '#b0bec5',
              fontSize: '12px',
              marginBottom: '6px',
              display: 'block'
            }}>
              Sun Intensity
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sunIntensity}
              onChange={(e) => setSunIntensity(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                background: `linear-gradient(to right, #64b5f6 0%, #64b5f6 ${sunIntensity}%, rgba(45, 64, 89, 0.5) ${sunIntensity}%, rgba(45, 64, 89, 0.5) 100%)`,
                borderRadius: '3px',
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              color: '#b0bec5',
              fontSize: '12px',
              marginBottom: '6px',
              display: 'block'
            }}>
              Water Color
            </label>
            <input 
              type="color" 
              defaultValue="#42a5f5"
              style={{
                width: '40px',
                height: '40px',
                border: '2px solid rgba(100, 181, 246, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'linear-gradient(45deg, #64b5f6, #42a5f5)'
              }}
            />
          </div>
        </div>

        {/* Environment Section */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            color: '#ffa726',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            🌊 Environment
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              color: '#b0bec5',
              fontSize: '12px',
              marginBottom: '6px',
              display: 'block'
            }}>
              Bubble Density
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={bubbleDensity}
              onChange={(e) => setBubbleDensity(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                background: `linear-gradient(to right, #64b5f6 0%, #64b5f6 ${bubbleDensity}%, rgba(45, 64, 89, 0.5) ${bubbleDensity}%, rgba(45, 64, 89, 0.5) 100%)`,
                borderRadius: '3px',
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              color: '#b0bec5',
              fontSize: '12px',
              marginBottom: '6px',
              display: 'block'
            }}>
              Current Strength
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={currentStrength}
              onChange={(e) => setCurrentStrength(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                background: `linear-gradient(to right, #64b5f6 0%, #64b5f6 ${currentStrength}%, rgba(45, 64, 89, 0.5) ${currentStrength}%, rgba(45, 64, 89, 0.5) 100%)`,
                borderRadius: '3px',
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>
        </div>

        {/* Fish Section */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            color: '#ffa726',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            🐠 Fish
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              color: '#b0bec5',
              fontSize: '12px',
              marginBottom: '6px',
              display: 'block'
            }}>
              School Size
            </label>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={schoolSize}
              onChange={(e) => setSchoolSize(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                background: `linear-gradient(to right, #64b5f6 0%, #64b5f6 ${(schoolSize - 5) / 45 * 100}%, rgba(45, 64, 89, 0.5) ${(schoolSize - 5) / 45 * 100}%, rgba(45, 64, 89, 0.5) 100%)`,
                borderRadius: '3px',
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              color: '#b0bec5',
              fontSize: '12px',
              marginBottom: '6px',
              display: 'block'
            }}>
              Swimming Speed
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={swimmingSpeed}
              onChange={(e) => setSwimmingSpeed(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                background: `linear-gradient(to right, #64b5f6 0%, #64b5f6 ${(swimmingSpeed - 1) / 9 * 100}%, rgba(45, 64, 89, 0.5) ${(swimmingSpeed - 1) / 9 * 100}%, rgba(45, 64, 89, 0.5) 100%)`,
                borderRadius: '3px',
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '120px',
        right: '320px',
        bottom: '50px',
        background: 'radial-gradient(ellipse at center, rgba(26, 35, 50, 0.3) 0%, rgba(15, 20, 25, 0.8) 100%)',
        border: '1px solid rgba(100, 181, 246, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden'
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
          
          {/* Placed Objects */}
          {placedObjects.map(obj => (
            <PlacedObject 
              key={obj.id}
              position={obj.position}
              color={obj.color}
            />
          ))}
          
          <OrbitControls />
        </Canvas>
      </div>

      {/* Status Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50px',
        background: 'rgba(15, 20, 25, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 165, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b0bec5', fontSize: '12px' }}>
          🪨 Objects: <span style={{ color: '#64b5f6', fontWeight: '600' }}>{placedObjects.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b0bec5', fontSize: '12px' }}>
          🐠 Fish: <span style={{ color: '#64b5f6', fontWeight: '600' }}>8</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b0bec5', fontSize: '12px' }}>
          ⚡ FPS: <span style={{ color: '#64b5f6', fontWeight: '600' }}>60</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b0bec5', fontSize: '12px' }}>
          📐 Camera: <span style={{ color: '#64b5f6', fontWeight: '600' }}>Orbit</span>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handlePlaceObject}
        style={{
          position: 'absolute',
          bottom: '70px',
          right: '30px',
          width: '56px',
          height: '56px',
          background: 'linear-gradient(45deg, #ff7043, #ffa726)',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: '#0f1419',
          boxShadow: '0 4px 20px rgba(255, 167, 38, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
      >
        {selectedObject}
      </button>
    </div>
  )
}

export default App 