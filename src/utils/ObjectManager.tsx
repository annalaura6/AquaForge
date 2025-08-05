import Rock from '../objects/Rock'
import Coral from '../objects/Coral'

export interface AquariumObject {
  id: string
  type: 'rock' | 'coral' | 'plant'
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  properties: any
}

interface ObjectManagerProps {
  objects: AquariumObject[]
  selectedObjectId: string | null
  onObjectSelect: (id: string | null) => void
  onObjectRemove: (id: string) => void
}

const ObjectManager = ({ 
  objects, 
  selectedObjectId, 
  onObjectSelect, 
  onObjectRemove: _onObjectRemove 
}: ObjectManagerProps) => {
  
  const renderObject = (obj: AquariumObject) => {
    const isSelected = selectedObjectId === obj.id

    switch (obj.type) {
      case 'rock':
        return (
          <Rock
            key={obj.id}
            position={obj.position}
            rotation={obj.rotation}
            scale={obj.scale}
            size={obj.properties.size}
            rockType={obj.properties.rockType}
            isSelected={isSelected}
            onSelect={() => onObjectSelect(obj.id)}
            onDeselect={() => onObjectSelect(null)}
          />
        )
      case 'coral':
        return (
          <Coral
            key={obj.id}
            position={obj.position}
            rotation={obj.rotation}
            scale={obj.scale}
            coralType={obj.properties.coralType}
            height={obj.properties.height}
            isSelected={isSelected}
            onSelect={() => onObjectSelect(obj.id)}
            onDeselect={() => onObjectSelect(null)}
          />
        )
      default:
        return null
    }
  }

  return (
    <group>
      {objects.map(renderObject)}
    </group>
  )
}

export default ObjectManager 