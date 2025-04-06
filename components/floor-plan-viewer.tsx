"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useNavigation } from "@/context/navigation-context"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloorPlanViewerProps {
  showNavigation?: boolean
}

export default function FloorPlanViewer({ showNavigation = false }: FloorPlanViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    floorPlans,
    currentFloor,
    currentLocation,
    destinationLocation,
    navigationPath,
    setCurrentLocation,
    pointsOfInterest,
    setCurrentFloor,
  } = useNavigation()

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const currentFloorPlan = floorPlans[currentFloor]
  const floorPOIs = pointsOfInterest.filter((poi) => poi.floor === currentFloor)

  // Pan and zoom functionality
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(scale * delta, 0.5), 3)
    setScale(newScale)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      })
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const zoomIn = () => {
    setScale(Math.min(scale * 1.2, 3))
  }

  const zoomOut = () => {
    setScale(Math.max(scale * 0.8, 0.5))
  }

  // Handle POI click
  const handlePoiClick = (poiId: string) => {
    const poi = pointsOfInterest.find((p) => p.id === poiId)
    if (poi) {
      // If the POI is on a different floor, switch to that floor first
      if (poi.floor !== currentFloor) {
        setCurrentFloor(poi.floor)
      }

      // Set the location
      setCurrentLocation(poi)
    }
  }

  // Reset position when floor changes
  useEffect(() => {
    resetView()
  }, [currentFloor])

  return (
    <div className="relative w-full h-full overflow-hidden" ref={containerRef}>
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="secondary" size="icon" onClick={zoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={zoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={resetView}>
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={cn("w-full h-full", isDragging ? "cursor-grabbing" : "cursor-grab")}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${currentFloorPlan.width} ${currentFloorPlan.height}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          {/* Floor plan background */}
          <rect x="0" y="0" width={currentFloorPlan.width} height={currentFloorPlan.height} fill="#ffffff" />

          {/* Floor title */}
          <text x="100" y="50" fontSize="32" fontWeight="bold" fill="#000">
            {currentFloorPlan.name}
          </text>

          {/* Floor access information */}
          {currentFloor === 1 && (
            <text x="100" y="80" fontSize="16" fill="#666">
              Bereikbaar via de trap in de centrale hal
            </text>
          )}

          {(currentFloor === 2 || currentFloor === 3) && (
            <text x="100" y="80" fontSize="16" fill="#666">
              Bereikbaar via de trap in de vleugel
            </text>
          )}

          {/* Department headers for this floor */}
          {floorPOIs.length > 0 && (
            <>
              {/* Get unique categories on this floor */}
              {Array.from(new Set(floorPOIs.map((poi) => poi.category))).map((category, index) => {
                const categoryPoi = floorPOIs.find((poi) => poi.category === category)
                if (!categoryPoi) return null

                return (
                  <g key={`cat-${category}`}>
                    <rect x="100" y={100 + index * 40} width="250" height="30" fill="#000" />
                    <text x="110" y={120 + index * 40} fontSize="16" fontWeight="bold" fill="#fff">
                      {categoryPoi.categoryName}
                    </text>
                    {/* Category icon */}
                    <rect x="90" y={100 + index * 40} width="10" height="30" fill={categoryPoi.color} />
                  </g>
                )
              })}
            </>
          )}

          {/* Floor plan walls and structures */}
          {currentFloorPlan.walls.map((wall, index) => (
            <path
              key={`wall-${index}`}
              d={wall.path}
              fill="none"
              stroke="#333"
              strokeWidth="2"
              strokeDasharray={wall.dashed ? "5,5" : "none"}
            />
          ))}

          {/* Rooms */}
          {currentFloorPlan.rooms.map((room) => (
            <g key={`room-${room.id}`}>
              <path d={room.path} fill={room.color || "#f0f0f0"} stroke="#333" strokeWidth="1" />
              <text
                x={room.labelPosition.x}
                y={room.labelPosition.y}
                fontSize="14"
                textAnchor="middle"
                fill={room.color ? "#fff" : "#666"}
                fontWeight="bold"
              >
                {room.name}
              </text>
            </g>
          ))}

          {/* Stairs */}
          {currentFloorPlan.stairs.map((stair, index) => (
            <g key={`stair-${index}`}>
              {/* Stair icon with hatching pattern */}
              <rect
                x={stair.x}
                y={stair.y}
                width={stair.width}
                height={stair.height}
                fill="#ddd"
                stroke="#999"
                strokeWidth="1"
              />
              <pattern
                id={`hatch-${index}`}
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="4" stroke="#999" strokeWidth="1" />
              </pattern>
              <rect x={stair.x} y={stair.y} width={stair.width} height={stair.height} fill={`url(#hatch-${index})`} />
              <text x={stair.x + stair.width / 2} y={stair.y - 5} fontSize="10" textAnchor="middle" fill="#666">
                {stair.label}
              </text>
            </g>
          ))}

          {/* Points of Interest */}
          {floorPOIs.map((poi) => (
            <g key={`poi-${poi.id}`} onClick={() => handlePoiClick(poi.id)} style={{ cursor: "pointer" }}>
              <circle
                cx={poi.position.x}
                cy={poi.position.y}
                r="15"
                fill={
                  poi.id === currentLocation?.id
                    ? "#22c55e"
                    : poi.id === destinationLocation?.id
                      ? "#ef4444"
                      : poi.color
                }
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x={poi.position.x}
                y={poi.position.y + 4}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                fill="#fff"
              >
                {poi.number}
              </text>
              <text
                x={poi.position.x}
                y={poi.position.y + 30}
                fontSize="10"
                textAnchor="middle"
                fill="#333"
                fontWeight="bold"
              >
                {poi.name.length > 20 ? poi.name.substring(0, 20) + "..." : poi.name}
              </text>
            </g>
          ))}

          {/* Navigation Path */}
          {showNavigation && navigationPath && navigationPath[currentFloor] && (
            <path
              d={navigationPath[currentFloor]}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="5,5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Current location marker */}
          {currentLocation && currentLocation.floor === currentFloor && (
            <circle
              cx={currentLocation.position.x}
              cy={currentLocation.position.y}
              r="6"
              fill="#22c55e"
              stroke="#fff"
              strokeWidth="2"
            >
              <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
      </div>
    </div>
  )
}

