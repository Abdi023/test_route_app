export interface Position {
  x: number
  y: number
}

export interface Wall {
  path: string
  dashed?: boolean
}

export interface Room {
  id: string
  name: string
  path: string
  labelPosition: Position
  color?: string
}

export interface Stairs {
  x: number
  y: number
  width: number
  height: number
  label: string
}

export interface PointOfInterest {
  id: string
  number: string
  name: string
  description: string
  position: Position
  category: "design" | "software" | "media" | "av" | "backstage" | "algemeen"
  categoryName: string
  floor: number
  color: string
}

export interface FloorPlan {
  id: string
  name: string
  width: number
  height: number
  walls: Wall[]
  rooms: Room[]
  stairs: Stairs[]
}

export interface NavigationStep {
  instruction: string
  direction: "left" | "right" | "forward" | "up" | "down"
  distance: number
  targetFloor?: number
}

