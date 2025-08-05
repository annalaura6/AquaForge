import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export interface PlaceableObjectProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  color?: string
  isSelected?: boolean
  onSelect?: () => void
  onDeselect?: () => void
}

const PlaceableObject = ({ 
  position, 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1], 
  color = "#8B4513",
  isSelected = false,
  onSelect,
  onDeselect
}: PlaceableObjectProps) => {
  const meshRef = useRef<Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      // Subtle selection animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
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
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={isSelected ? "#FFD700" : isHovered ? "#FFA500" : color}
        transparent
        opacity={isSelected ? 0.8 : 1}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  )
}

export default PlaceableObject 