import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import * as THREE from 'three'

// Aquarium filter component with bubbles and current
const AquariumFilter = ({ bubbleDensity, currentStrength, tankSize }: { bubbleDensity: number, currentStrength: number, tankSize: number }) => {
  const filterRef = useRef<THREE.Group>(null)
  const bubbleRefs = useRef<THREE.Mesh[]>([])
  
  // Generate bubbles based on density - much more bubbles
  const bubbleCount = Math.floor(bubbleDensity / 3) + 5
  const bubbles = useMemo(() => {
    const bubbleArray = []
    for (let i = 0; i < bubbleCount; i++) {
      bubbleArray.push({
        id: i,
        x: (Math.random() - 0.5) * 0.3,
        y: Math.random() * 0.5,
        z: (Math.random() - 0.5) * 0.3,
        speed: 0.02 + Math.random() * 0.03,
        size: 0.02 + Math.random() * 0.03,
        wobble: Math.random() * Math.PI * 2
      })
    }
    return bubbleArray
  }, [bubbleCount])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Animate bubbles
    bubbles.forEach((bubble, index) => {
      const bubbleMesh = bubbleRefs.current[index]
      if (bubbleMesh) {
        // Calculate smooth curve parameters based on current strength
        const maxDistance = (currentStrength / 100) * tankSize * 0.9 // Full tank length
        const progress = bubbleMesh.position.x / maxDistance // How far along the curve (0 to 1)
        
        // Smooth curve using sine function for natural arc
        const curveAngle = progress * Math.PI // 0 to π radians
        const curveRadius = maxDistance / Math.PI // Radius of the curve
        
        // Calculate smooth movement along the curve
        const forwardSpeed = bubble.speed * (bubbleDensity / 30) * 4 // Faster movement
        const upwardSpeed = bubble.speed * (bubbleDensity / 30) * 2
        
        // Smooth curve movement (no sharp turns)
        if (progress < 1) {
          // Move along the curve smoothly
          bubbleMesh.position.x += forwardSpeed
          bubbleMesh.position.y += Math.sin(curveAngle) * upwardSpeed * 2
          
          // Add gentle spread to the sides
          bubbleMesh.position.z += Math.sin(time * 1.5 + bubble.wobble) * 0.01
        } else {
          // After the curve, rise vertically
          bubbleMesh.position.y += upwardSpeed
        }
        
        // Add gentle wobble
        bubbleMesh.position.x += Math.sin(time * 2 + bubble.wobble) * 0.005
        bubbleMesh.position.z += Math.cos(time * 1.5 + bubble.wobble) * 0.005
        
        // Reset bubble when it reaches top or goes too far
        if (bubbleMesh.position.y > tankSize * 0.4 || bubbleMesh.position.x > tankSize * 0.95) {
          bubbleMesh.position.y = -tankSize * 0.2
          bubbleMesh.position.x = 0.25 + (Math.random() - 0.5) * 0.3
          bubbleMesh.position.z = (Math.random() - 0.5) * 0.3
        }
      }
    })
  })

  return (
    <group ref={filterRef} position={[-tankSize * 0.45, 0, 0]}>
      {/* Filter housing (main body) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, tankSize * 0.5, 0.2]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Filter intake tube */}
      <mesh position={[0, -tankSize * 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#34495e" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Filter outlet (bubble generator) */}
      <mesh position={[0.15, -tankSize * 0.15, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 6]} />
        <meshStandardMaterial color="#7f8c8d" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Bubble diffuser plate */}
      <mesh position={[0.2, -tankSize * 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
        <meshStandardMaterial color="#95a5a6" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Filter mounting bracket */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.1, tankSize * 0.6, 0.05]} />
        <meshStandardMaterial color="#34495e" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Generate bubbles */}
      {bubbles.map((bubble, index) => (
        <mesh
          key={bubble.id}
          ref={(el) => {
            if (el) bubbleRefs.current[index] = el
          }}
          position={[0.25 + bubble.x, -tankSize * 0.15 + bubble.y, bubble.z]}
        >
          <sphereGeometry args={[bubble.size, 6, 6]} />
          <meshPhysicalMaterial 
            color="#ffffff"
            transparent
            opacity={0.6}
            metalness={0.1}
            roughness={0.2}
            ior={1.33}
          />
        </mesh>
      ))}
    </group>
  )
}

// Water volume component (colored water inside tank)
const WaterVolume = ({ tankSize }: { tankSize: number }) => {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[tankSize * 0.9, tankSize * 0.6, tankSize * 0.4]} />
      <meshPhysicalMaterial 
        color="#4A90E2"
        transparent
        opacity={0.3}
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



// Component for fish school
const FishSchool = ({ schoolSize, swimmingSpeed, fishSize, randomizeFishSizes, tankSize, currentStrength }: { schoolSize: number, swimmingSpeed: number, fishSize: number, randomizeFishSizes: boolean, tankSize: number, currentStrength: number }) => {
  const fishRefs = useRef<THREE.Group[]>([])
  
  // Calculate tank bounds based on tank size
  const tankBounds = {
    x: tankSize * 0.5,
    y: tankSize * 0.33,
    z: tankSize * 0.25
  }
  
  // Generate fish data with persistent references
  const fishData = useMemo(() => {
    const fish = []
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
    
    for (let i = 0; i < schoolSize; i++) {
      fish.push({
        id: i,
        // Enhanced swimming parameters for better movement
        timeOffset: Math.random() * Math.PI * 2,
        amplitude: 0.8 + Math.random() * 0.8,
        frequency: 0.3 + Math.random() * 0.4,
        direction: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        // Fish size parameters
        size: randomizeFishSizes ? fishSize * (0.7 + Math.random() * 0.6) : fishSize, // Random size variation from 0.7x to 1.3x base size
        // New parameters for better exploration
        targetX: (Math.random() - 0.5) * tankBounds.x * 1.2,
        targetY: (Math.random() - 0.5) * tankBounds.y * 1.2 + 0.5,
        targetZ: (Math.random() - 0.5) * tankBounds.z * 1.2,
        targetTime: 0,
        color: colors[i % colors.length]
      })
    }
    return fish
  }, [schoolSize, fishSize, randomizeFishSizes, tankSize])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    fishData.forEach((fish, index) => {
      const fishGroup = fishRefs.current[index]
      if (!fishGroup) return
      
      // Smooth, natural fish movement
      const adjustedTime = time * swimmingSpeed * 0.1 + fish.timeOffset
      
      // Update target less frequently for smoother paths
      fish.targetTime += 0.016
      if (fish.targetTime > 8 + Math.random() * 4) { // Change target every 8-12 seconds
        fish.targetX = (Math.random() - 0.5) * tankBounds.x * 0.8
        fish.targetY = (Math.random() - 0.5) * tankBounds.y * 0.8 + 0.5
        fish.targetZ = (Math.random() - 0.5) * tankBounds.z * 0.8
        fish.targetTime = 0
      }
      
      // Calculate smooth direction towards target
      const dx = fish.targetX - fishGroup.position.x
      const dz = fish.targetZ - fishGroup.position.z
      const targetDirection = Math.atan2(dz, dx)
      
      // Smooth direction interpolation (no sudden turns)
      let directionDiff = targetDirection - fish.direction
      // Handle angle wrapping
      if (directionDiff > Math.PI) directionDiff -= Math.PI * 2
      if (directionDiff < -Math.PI) directionDiff += Math.PI * 2
      
      // Very gradual direction change for smooth swimming
      fish.direction += directionDiff * 0.02
      
      // Natural wave-like body movement
      const bodyWave = Math.sin(adjustedTime * 3) * 0.08
      fish.direction += bodyWave
      
      // Smooth boundary avoidance
      const margin = 1.5
      if (Math.abs(fishGroup.position.x) > tankBounds.x - margin) {
        const avoidForce = (Math.abs(fishGroup.position.x) - (tankBounds.x - margin)) / margin
        fish.direction += fishGroup.position.x > 0 ? avoidForce * 0.02 : -avoidForce * 0.02
      }
      if (Math.abs(fishGroup.position.y) > tankBounds.y - margin) {
        const avoidForce = (Math.abs(fishGroup.position.y) - (tankBounds.y - margin)) / margin
        fish.direction += fishGroup.position.y > 0 ? avoidForce * 0.01 : -avoidForce * 0.01
      }
      if (Math.abs(fishGroup.position.z) > tankBounds.z - margin) {
        const avoidForce = (Math.abs(fishGroup.position.z) - (tankBounds.z - margin)) / margin
        fish.direction += fishGroup.position.z > 0 ? avoidForce * 0.02 : -avoidForce * 0.02
      }
      
             // Smooth, consistent forward movement (no current effect)
       const baseSpeed = fish.speed * swimmingSpeed * 0.4
       const forwardX = Math.cos(fish.direction) * baseSpeed
       const forwardZ = Math.sin(fish.direction) * baseSpeed
      
      // Natural up-down swimming motion (gentle sine wave)
      const verticalWave = Math.sin(adjustedTime * 1.5) * 0.008
      
      // Side-to-side swimming motion (fish body undulation)
      const sideWave = Math.sin(adjustedTime * 2.5) * 0.005
      const sideX = Math.cos(fish.direction + Math.PI/2) * sideWave
      const sideZ = Math.sin(fish.direction + Math.PI/2) * sideWave
      
             // Apply smooth movement directly to fish group (no current effect)
       fishGroup.position.x += forwardX + sideX
       fishGroup.position.y += verticalWave
       fishGroup.position.z += forwardZ + sideZ
      
      // Set fish orientation
      fishGroup.rotation.y = fish.direction
      
      // Gentle boundary enforcement
      fishGroup.position.x = Math.max(-tankBounds.x * 0.9, Math.min(tankBounds.x * 0.9, fishGroup.position.x))
      fishGroup.position.y = Math.max(-tankBounds.y * 0.9, Math.min(tankBounds.y * 0.9, fishGroup.position.y))
      fishGroup.position.z = Math.max(-tankBounds.z * 0.9, Math.min(tankBounds.z * 0.9, fishGroup.position.z))
      
      // Natural swimming body roll
      fishGroup.rotation.z = Math.sin(adjustedTime * 2) * 0.03
      fishGroup.rotation.x = Math.sin(adjustedTime * 1.8) * 0.02
    })
  })
  
  return (
    <>
      {fishData.map((fish, index) => (
        <group
          key={fish.id}
          ref={(el) => {
            if (el) {
              fishRefs.current[index] = el
              // Set initial position only once
              if (el.position.x === 0 && el.position.y === 0 && el.position.z === 0) {
                el.position.set(
                  (Math.random() - 0.5) * tankBounds.x * 1.6,
                  (Math.random() - 0.5) * tankBounds.y * 1.6 + 0.5,
                  (Math.random() - 0.5) * tankBounds.z * 1.6
                )
              }
            }
          }}
          rotation={[0, fish.direction, 0]}
          scale={[fish.size, fish.size, fish.size]}
        >
          {/* Fish Body (main ellipsoid) */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 6]} />
            <meshStandardMaterial color={fish.color} metalness={0.1} roughness={0.8} />
          </mesh>
          
          {/* Fish Head (smaller ellipsoid) */}
          <mesh position={[0.06, 0, 0]} scale={[0.7, 0.8, 0.8]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color={fish.color} metalness={0.2} roughness={0.6} />
          </mesh>
          
          {/* Tail Fin */}
          <mesh position={[-0.09, 0, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.04, 0.08, 3]} />
            <meshStandardMaterial color={fish.color} transparent opacity={0.8} />
          </mesh>
          
          {/* Top Dorsal Fin */}
          <mesh position={[-0.02, 0.06, 0]} rotation={[Math.PI/2, 0, 0]} scale={[0.8, 0.6, 0.4]}>
            <coneGeometry args={[0.025, 0.05, 3]} />
            <meshStandardMaterial color={fish.color} transparent opacity={0.7} />
          </mesh>
          
          {/* Side Fins (Pectoral) */}
          <mesh position={[0.02, -0.02, 0.05]} rotation={[0, Math.PI/4, Math.PI/3]} scale={[0.6, 0.4, 0.3]}>
            <coneGeometry args={[0.02, 0.04, 3]} />
            <meshStandardMaterial color={fish.color} transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.02, -0.02, -0.05]} rotation={[0, -Math.PI/4, -Math.PI/3]} scale={[0.6, 0.4, 0.3]}>
            <coneGeometry args={[0.02, 0.04, 3]} />
            <meshStandardMaterial color={fish.color} transparent opacity={0.6} />
          </mesh>
          
          {/* Bottom Fin (Anal) */}
          <mesh position={[-0.01, -0.05, 0]} rotation={[-Math.PI/2, 0, 0]} scale={[0.6, 0.4, 0.3]}>
            <coneGeometry args={[0.015, 0.03, 3]} />
            <meshStandardMaterial color={fish.color} transparent opacity={0.6} />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[0.08, 0.02, 0.025]}>
            <sphereGeometry args={[0.008, 4, 4]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.08, 0.02, -0.025]}>
            <sphereGeometry args={[0.008, 4, 4]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      ))}
    </>
  )
}

function App() {
  const [placedObjects, setPlacedObjects] = useState<Array<{ id: number, position: [number, number, number], color: string }>>([])
  const [objectCounter, setObjectCounter] = useState(0)
  const [selectedObject, setSelectedObject] = useState('🪨')
  const [timeOfDay, setTimeOfDay] = useState(50) // 0 = night, 50 = noon, 100 = sunset
  const [bubbleDensity, setBubbleDensity] = useState(40)
  const [currentStrength, setCurrentStrength] = useState(30)
  const [schoolSize, setSchoolSize] = useState(15)
  const [swimmingSpeed, setSwimmingSpeed] = useState(5)
  const [fishSize, setFishSize] = useState(1)
  const [randomizeFishSizes, setRandomizeFishSizes] = useState(true)
  const [tankSize, setTankSize] = useState(12)
  const [fps, setFps] = useState(60)

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

  const handleSave = () => {
    const aquariumData = {
      objects: placedObjects,
      settings: {
        timeOfDay,
        bubbleDensity,
        currentStrength,
        schoolSize,
        swimmingSpeed,
        fishSize,
        randomizeFishSizes,
        tankSize
      }
    }
    localStorage.setItem('aquaforge-save', JSON.stringify(aquariumData))
    console.log('Aquarium saved!')
  }

  const handleLoad = () => {
    const saved = localStorage.getItem('aquaforge-save')
    if (saved) {
      const data = JSON.parse(saved)
      setPlacedObjects(data.objects || [])
      setObjectCounter(data.objects?.length || 0)
      if (data.settings) {
        setTimeOfDay(data.settings.timeOfDay || 50)
        setBubbleDensity(data.settings.bubbleDensity || 40)
        setCurrentStrength(data.settings.currentStrength || 30)
        setSchoolSize(data.settings.schoolSize || 15)
        setSwimmingSpeed(data.settings.swimmingSpeed || 5)
        setFishSize(data.settings.fishSize || 1)
        setRandomizeFishSizes(data.settings.randomizeFishSizes !== undefined ? data.settings.randomizeFishSizes : true)
        setTankSize(data.settings.tankSize || 12)
      }
      console.log('Aquarium loaded!')
    }
  }

  const handleReset = () => {
    setPlacedObjects([])
    setObjectCounter(0)
    setTimeOfDay(50)
    setBubbleDensity(40)
    setCurrentStrength(30)
    setSchoolSize(15)
    setSwimmingSpeed(5)
    setFishSize(1)
    setRandomizeFishSizes(true)
    setTankSize(12)
    console.log('Aquarium reset!')
  }

  const handleScreenshot = () => {
    // Simulate screenshot functionality
    console.log('Screenshot taken!')
  }

  // Update FPS randomly for demo
  useState(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 5) + 58)
    }, 1000)
    return () => clearInterval(interval)
  })

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
          {[
            { text: '💾 Save', onClick: handleSave },
            { text: '📁 Load', onClick: handleLoad },
            { text: '📸 Screenshot', onClick: handleScreenshot },
            { text: '🔄 Reset', onClick: handleReset }
          ].map((button, index) => (
            <button 
              key={index} 
              onClick={button.onClick}
              style={{
                padding: '8px 16px',
                background: 'rgba(100, 181, 246, 0.1)',
                border: '1px solid rgba(100, 181, 246, 0.3)',
                borderRadius: '6px',
                color: '#64b5f6',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(100, 181, 246, 0.2)'
                e.currentTarget.style.boxShadow = '0 0 10px rgba(100, 181, 246, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(100, 181, 246, 0.1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {button.text}
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
            onMouseEnter={(e) => {
              if (selectedObject !== emoji) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = '#64b5f6'
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(100, 181, 246, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedObject !== emoji) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(100, 181, 246, 0.3)'
                e.currentTarget.style.boxShadow = 'none'
              }
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
                 {/* Time of Day Section */}
         <div style={{ marginBottom: '25px' }}>
           <div style={{
             color: '#ffa726',
             fontSize: '14px',
             fontWeight: '600',
             marginBottom: '12px',
             textTransform: 'uppercase',
             letterSpacing: '1px'
           }}>
             ☀️ Time of Day
           </div>
           <div style={{ marginBottom: '15px' }}>
             <div style={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               marginBottom: '8px'
             }}>
               <span style={{ fontSize: '18px' }}>🌙</span>
               <label style={{
                 color: '#b0bec5',
                 fontSize: '12px',
                 textAlign: 'center'
               }}>
                 {timeOfDay <= 20 ? 'Night' : 
                  timeOfDay <= 40 ? 'Dawn' : 
                  timeOfDay <= 60 ? 'Day' : 
                  timeOfDay <= 80 ? 'Afternoon' : 'Sunset'}
               </label>
               <span style={{ fontSize: '18px' }}>☀️</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={timeOfDay}
               onChange={(e) => setTimeOfDay(Number(e.target.value))}
               style={{
                 width: '100%',
                 height: '6px',
                 background: `linear-gradient(to right, #1a1a2e 0%, #16213e 20%, #0f4c75 40%, #ffa726 50%, #ff7043 80%, #8b1538 100%)`,
                 borderRadius: '3px',
                 outline: 'none',
                 WebkitAppearance: 'none'
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
           <div style={{ marginBottom: '15px' }}>
             <label style={{
               color: '#b0bec5',
               fontSize: '12px',
               marginBottom: '6px',
               display: 'block'
             }}>
               Fish Size
             </label>
             <input 
               type="range" 
               min="0.5" 
               max="3" 
               step="0.1"
               value={fishSize}
               onChange={(e) => setFishSize(Number(e.target.value))}
               style={{
                 width: '100%',
                 height: '6px',
                 background: `linear-gradient(to right, #64b5f6 0%, #64b5f6 ${(fishSize - 0.5) / 2.5 * 100}%, rgba(45, 64, 89, 0.5) ${(fishSize - 0.5) / 2.5 * 100}%, rgba(45, 64, 89, 0.5) 100%)`,
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
               display: 'flex',
               alignItems: 'center',
               gap: '8px'
             }}>
               <input 
                 type="checkbox" 
                 checked={randomizeFishSizes}
                 onChange={(e) => setRandomizeFishSizes(e.target.checked)}
                 style={{
                   accentColor: '#64b5f6',
                   width: '16px',
                   height: '16px'
                 }}
               />
               Randomize Fish Sizes
             </label>
           </div>
         </div>

        {/* Tank Section */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            color: '#ffa726',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            🏠 Tank
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              color: '#b0bec5',
              fontSize: '12px',
              marginBottom: '6px',
              display: 'block'
            }}>
              Tank Size
            </label>
            <input 
              type="range" 
              min="8" 
              max="20" 
              value={tankSize}
              onChange={(e) => setTankSize(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                background: `linear-gradient(to right, #64b5f6 0%, #64b5f6 ${(tankSize - 8) / 12 * 100}%, rgba(45, 64, 89, 0.5) ${(tankSize - 8) / 12 * 100}%, rgba(45, 64, 89, 0.5) 100%)`,
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
          {/* Dynamic Skybox based on time of day */}
          <Sky 
            distance={450000}
            sunPosition={[
              Math.cos((timeOfDay / 100) * Math.PI * 2) * 5,
              Math.sin((timeOfDay / 100) * Math.PI) * 5,
              Math.sin((timeOfDay / 100) * Math.PI * 2) * 2
            ]}
            inclination={Math.max(0.1, Math.sin((timeOfDay / 100) * Math.PI))}
            azimuth={(timeOfDay / 100) * 0.5}
            rayleigh={timeOfDay <= 20 || timeOfDay >= 80 ? 0.5 : 1}
            turbidity={timeOfDay <= 20 || timeOfDay >= 80 ? 15 : 10}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />
          
          {/* Dynamic lighting based on time of day */}
          <ambientLight 
            intensity={Math.max(0.1, Math.sin((timeOfDay / 100) * Math.PI) * 0.6)} 
            color={
              timeOfDay <= 20 ? "#1a1a3e" :
              timeOfDay <= 40 ? "#4a6fa5" :
              timeOfDay <= 60 ? "#87ceeb" :
              timeOfDay <= 80 ? "#ffa726" : "#ff6b35"
            } 
          />
          <directionalLight 
            position={[
              Math.cos((timeOfDay / 100) * Math.PI * 2) * 5,
              Math.max(2, Math.sin((timeOfDay / 100) * Math.PI) * 10),
              Math.sin((timeOfDay / 100) * Math.PI * 2) * 5
            ]} 
            intensity={Math.max(0.1, Math.sin((timeOfDay / 100) * Math.PI) * 1.2)} 
            color={
              timeOfDay <= 20 ? "#6a5acd" :
              timeOfDay <= 40 ? "#87ceeb" :
              timeOfDay <= 60 ? "#ffffff" :
              timeOfDay <= 80 ? "#ffa726" : "#ff4500"
            }
          />
          
          {/* Glass Aquarium Container */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[tankSize, tankSize * 0.67, tankSize * 0.5]} />
            <meshPhysicalMaterial 
              color="#ffffff"
              transparent
              opacity={0.1}
              metalness={0.9}
              roughness={0.1}
              ior={1.5}
              thickness={0.5}
              envMapIntensity={1.0}
            />
          </mesh>
          
                     {/* Water Volume (colored water inside tank) */}
           <WaterVolume tankSize={tankSize} />
           
           {/* Aquarium Filter with Bubbles */}
           <AquariumFilter bubbleDensity={bubbleDensity} currentStrength={currentStrength} tankSize={tankSize} />
          
          {/* Seafloor */}
          <mesh position={[0, -tankSize * 0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[tankSize * 0.83, tankSize * 0.42]} />
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
          
                                 {/* Fish School */}
            <FishSchool schoolSize={schoolSize} swimmingSpeed={swimmingSpeed} fishSize={fishSize} randomizeFishSizes={randomizeFishSizes} tankSize={tankSize} currentStrength={currentStrength} />
          
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
           🐠 Fish: <span style={{ color: '#64b5f6', fontWeight: '600' }}>{schoolSize}</span>
         </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b0bec5', fontSize: '12px' }}>
          ⚡ FPS: <span style={{ color: '#64b5f6', fontWeight: '600' }}>{fps}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b0bec5', fontSize: '12px' }}>
          📐 Camera: <span style={{ color: '#64b5f6', fontWeight: '600' }}>Orbit</span>
        </div>
        
        {/* Watermark in footer */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: '#ffa726',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Made by Anna
          </div>
          <div style={{
            display: 'flex',
            gap: '6px'
          }}>
            <a 
              href="https://github.com/annalaura6" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                background: 'linear-gradient(45deg, #333, #666)',
                borderRadius: '4px',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              📱
            </a>
            <a 
              href="https://zielinskart.carbonmade.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                background: 'linear-gradient(45deg, #64b5f6, #42a5f5)',
                borderRadius: '4px',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(100, 181, 246, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              🎨
            </a>
          </div>
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
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 167, 38, 0.6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 167, 38, 0.4)'
        }}
      >
        {selectedObject}
      </button>
    </div>
  )
}

export default App 