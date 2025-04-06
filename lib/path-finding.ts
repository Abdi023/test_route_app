import type { FloorPlan, PointOfInterest, NavigationStep } from "@/types/navigation"

// Calculate path between two points across multiple floors
export function calculatePath(
  floorPlans: FloorPlan[],
  pointsOfInterest: PointOfInterest[],
  start: PointOfInterest,
  end: PointOfInterest,
): { paths: Record<number, string | null>; steps: NavigationStep[] } {
  const paths: Record<number, string | null> = {}
  const steps: NavigationStep[] = []

  // If on the same floor, calculate direct path
  if (start.floor === end.floor) {
    const floorPath = generatePathOnSameFloor(floorPlans[start.floor], start, end)
    paths[start.floor] = floorPath

    // Generate steps for same floor navigation
    steps.push({
      instruction: `Start vanaf ${start.name}`,
      direction: "forward",
      distance: 0,
    })

    // Add intermediate steps based on the path
    const intermediateSteps = generateIntermediateSteps(start, end)
    steps.push(...intermediateSteps)

    // Final step
    steps.push({
      instruction: `Je hebt je bestemming bereikt: ${end.name}`,
      direction: "forward",
      distance: 0,
    })
  } else {
    // Multi-floor navigation
    // Find nearest stairs on current floor
    const startFloorStairs = findNearestStairs(floorPlans[start.floor], start)

    // Path from start to stairs on starting floor
    paths[start.floor] = generatePathOnSameFloor(floorPlans[start.floor], start, {
      ...startFloorStairs,
      id: "stairs",
      name: "Trap",
      description: "Trap naar andere verdieping",
      category: "facility",
      categoryName: "Faciliteit",
      floor: start.floor,
      number: "T",
      color: "#666666",
    })

    // Initial steps
    steps.push({
      instruction: `Start vanaf ${start.name}`,
      direction: "forward",
      distance: 0,
    })

    // Add steps to reach the stairs
    steps.push({
      instruction: "Loop naar de trap",
      direction: "forward",
      distance: 20,
    })

    // For multi-floor navigation, calculate intermediate floors
    const startFloor = start.floor
    const endFloor = end.floor
    const direction = endFloor > startFloor ? "up" : "down"

    // If we need to traverse multiple floors, add steps for each floor transition
    if (Math.abs(endFloor - startFloor) > 1) {
      // Add intermediate floors
      for (let floor = Math.min(startFloor, endFloor) + 1; floor < Math.max(startFloor, endFloor); floor++) {
        // Find stairs positions on this intermediate floor
        const floorStairs = findNearestStairs(floorPlans[floor], { position: { x: 0, y: 0 } })

        // Add path across this floor (from one staircase to another if needed)
        paths[floor] = generatePathOnSameFloor(
          floorPlans[floor],
          {
            ...floorStairs,
            id: "stairs-entry",
            name: "Trap",
            description: "Trap naar andere verdieping",
            category: "facility",
            categoryName: "Faciliteit",
            floor: floor,
            number: "T",
            color: "#666666",
          },
          {
            ...floorStairs, // In a more complex building, this could be a different staircase
            id: "stairs-exit",
            name: "Trap",
            description: "Trap naar andere verdieping",
            category: "facility",
            categoryName: "Faciliteit",
            floor: floor,
            number: "T",
            color: "#666666",
          },
        )

        // Add step for this intermediate floor
        steps.push({
          instruction: `Ga door de ${floorPlans[floor].name}`,
          direction: "forward",
          distance: 15,
          targetFloor: floor,
        })
      }
    }

    // Add step for using stairs to destination floor
    steps.push({
      instruction: `Ga ${Math.abs(endFloor - startFloor)} verdieping${Math.abs(endFloor - startFloor) > 1 ? "en" : ""} ${direction === "up" ? "omhoog" : "omlaag"} via de trap`,
      direction: direction,
      distance: Math.abs(endFloor - startFloor) * 5,
      targetFloor: end.floor,
    })

    // Find stairs on destination floor
    const endFloorStairs = findNearestStairs(floorPlans[end.floor], end)

    // Path from stairs to destination on end floor
    paths[end.floor] = generatePathOnSameFloor(
      floorPlans[end.floor],
      {
        ...endFloorStairs,
        id: "stairs",
        name: "Trap",
        description: "Trap naar andere verdieping",
        category: "facility",
        categoryName: "Faciliteit",
        floor: end.floor,
        number: "T",
        color: "#666666",
      },
      end,
    )

    // Add steps to reach the destination from stairs
    steps.push({
      instruction: `Loop vanaf de trap naar ${end.name}`,
      direction: "forward",
      distance: 15,
    })

    // Final step
    steps.push({
      instruction: `Je hebt je bestemming bereikt: ${end.name}`,
      direction: "forward",
      distance: 0,
    })
  }

  return { paths, steps }
}

// Find the nearest stairs to a position
function findNearestStairs(
  floorPlan: FloorPlan,
  poi: { position: { x: number; y: number } },
): { position: { x: number; y: number } } {
  // In a real implementation, this would find the actual nearest stairs
  // For this mock, we'll use the first stairs in the floor plan

  if (floorPlan.stairs.length > 0) {
    const stairs = floorPlan.stairs[0]
    return {
      position: {
        x: stairs.x + stairs.width / 2,
        y: stairs.y + stairs.height / 2,
      },
    }
  }

  // Fallback if no stairs found
  return {
    position: { x: poi.position.x, y: poi.position.y },
  }
}

// Generate a path between two points on the same floor
function generatePathOnSameFloor(
  floorPlan: FloorPlan,
  start: { position: { x: number; y: number } },
  end: { position: { x: number; y: number } },
): string {
  // In a real implementation, this would use a proper pathfinding algorithm
  // For this implementation, we'll create a more realistic path with waypoints

  // Start path data
  let pathData = `M ${start.position.x} ${start.position.y}`

  // Calculate direct distance
  const dx = end.position.x - start.position.x
  const dy = end.position.y - start.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  // For longer paths, add waypoints to make it more realistic and follow building layout
  if (distance > 50) {
    // Create a more natural path with intermediate points
    // First, move horizontally most of the way
    pathData += ` L ${start.position.x + dx * 0.7} ${start.position.y}`

    // Then, move vertically
    pathData += ` L ${start.position.x + dx * 0.7} ${start.position.y + dy * 0.7}`

    // Finally, move to the destination
    pathData += ` L ${end.position.x} ${end.position.y}`
  } else {
    // For short distances, a direct line is fine
    pathData += ` L ${end.position.x} ${end.position.y}`
  }

  return pathData
}

// Generate intermediate navigation steps
function generateIntermediateSteps(start: PointOfInterest, end: PointOfInterest): NavigationStep[] {
  const steps: NavigationStep[] = []

  // Determine the general direction
  const dx = end.position.x - start.position.x
  const dy = end.position.y - start.position.y

  // Horizontal movement
  if (Math.abs(dx) > 50) {
    const direction = dx > 0 ? "right" : "left"
    steps.push({
      instruction: `Ga naar ${direction === "right" ? "rechts" : "links"}`,
      direction,
      distance: Math.abs(dx) / 10,
    })
  }

  // Vertical movement
  if (Math.abs(dy) > 50) {
    const direction = dy > 0 ? "down" : "up"
    steps.push({
      instruction: `Ga ${direction === "down" ? "rechtdoor" : "terug"}`,
      direction: "forward",
      distance: Math.abs(dy) / 10,
    })
  }

  // If we're close to the destination
  if (steps.length === 0) {
    steps.push({
      instruction: "Loop rechtdoor naar je bestemming",
      direction: "forward",
      distance: 5,
    })
  }

  return steps
}

