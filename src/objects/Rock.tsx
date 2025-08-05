import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { PlaceableObjectProps } from './PlaceableObject'

interface RockProps extends PlaceableObjectProps {
  size?: 'small' | 'medium' | 'large'
  rockType?: 'granite' | 'limestone' | 'coral'
}

const Rock = ({ 
  position, 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1], 
  size = 'medium',
  rockType = 'granite',
  isSelected = false,
  onSelect,
  onDeselect
}: RockProps) => {
  const meshRef = useRef<Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Rock colors based on type
  const rockColors = {
    granite: "#696969",
    limestone: "#F5F5DC",
    coral: "#FF6B6B"
  }

  // Size multipliers
  const sizeMultipliers = {
    small: [0.5, 0.5, 0.5] as [number, number, number],
    medium: [1, 1, 1] as [number, number, number],
    large: [1.5, 1.5, 1.5] as [number, number, number]
  }

  const finalScale: [number, number, number] = [
    scale[0] * sizeMultipliers[size][0],
    scale[1] * sizeMultipliers[size][1],
    scale[2] * sizeMultipliers[size][2]
  ]

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      // Subtle rock selection animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05
    }
  })

  const handlePointerOver = () => {
    setIsHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setIsHovered(false)
    document.body.style.cursor = 'default'
  }

  const handleClick = () => {
    if (isSelected) {
      onDeselect?.()
    } else {
      onSelect?.()
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={finalScale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial 
        color={isSelected ? "#FFD700" : isHovered ? "#FFA500" : rockColors[rockType]}
        transparent
        opacity={isSelected ? 0.8 : 1}
        metalness={0.1}
        roughness={0.9}
      />
    </mesh>
  )
}

export default Rock 