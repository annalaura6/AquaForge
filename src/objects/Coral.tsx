import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { PlaceableObjectProps } from './PlaceableObject'

interface CoralProps extends PlaceableObjectProps {
  coralType?: 'branching' | 'brain' | 'mushroom'
  height?: number
}

const Coral = ({ 
  position, 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1], 
  coralType = 'branching',
  height = 2,
  isSelected = false,
  onSelect,
  onDeselect
}: CoralProps) => {
  const meshRef = useRef<Mesh>(null)

  // Coral colors based on type
  const coralColors = {
    branching: "#FF6B6B",
    brain: "#FF8C42",
    mushroom: "#FF69B4"
  }

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      // Gentle coral swaying animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'default'
  }

  const handleClick = () => {
    if (isSelected) {
      onDeselect?.()
    } else {
      onSelect?.()
    }
  }

  const renderCoralGeometry = () => {
    switch (coralType) {
      case 'branching':
        return (
          <group>
            {/* Main stem */}
            <mesh position={[0, height/2, 0]}>
              <cylinderGeometry args={[0.1, 0.1, height, 8]} />
              <meshStandardMaterial color={coralColors.branching} />
            </mesh>
            {/* Branches */}
            <mesh position={[0.3, height * 0.7, 0]} rotation={[0, 0, 0.3]}>
              <cylinderGeometry args={[0.05, 0.05, height * 0.4, 6]} />
              <meshStandardMaterial color={coralColors.branching} />
            </mesh>
            <mesh position={[-0.2, height * 0.8, 0]} rotation={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.05, 0.05, height * 0.3, 6]} />
              <meshStandardMaterial color={coralColors.branching} />
            </mesh>
          </group>
        )
      case 'brain':
        return (
          <mesh>
            <sphereGeometry args={[0.3, 8, 6]} />
            <meshStandardMaterial color={coralColors.brain} />
          </mesh>
        )
      case 'mushroom':
        return (
          <group>
            {/* Cap */}
            <mesh position={[0, height * 0.8, 0]}>
              <cylinderGeometry args={[0.4, 0.2, 0.2, 8]} />
              <meshStandardMaterial color={coralColors.mushroom} />
            </mesh>
            {/* Stem */}
            <mesh position={[0, height * 0.4, 0]}>
              <cylinderGeometry args={[0.1, 0.1, height * 0.8, 6]} />
              <meshStandardMaterial color={coralColors.mushroom} />
            </mesh>
          </group>
        )
      default:
        return (
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, height, 8]} />
            <meshStandardMaterial color={coralColors.branching} />
          </mesh>
        )
    }
  }

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {renderCoralGeometry()}
    </group>
  )
}

export default Coral 