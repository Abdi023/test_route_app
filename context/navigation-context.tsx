"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockFloorPlans, mockPointsOfInterest } from "@/data/mock-floor-plan"
import { calculatePath } from "@/lib/path-finding"
import type { FloorPlan, PointOfInterest, NavigationStep } from "@/types/navigation"

// Create a new context property and functions to expose
interface NavigationContextType {
  floorPlans: FloorPlan[]
  currentFloor: number
  setCurrentFloor: (floor: number) => void
  pointsOfInterest: PointOfInterest[]
  currentLocation: PointOfInterest | null
  destinationLocation: PointOfInterest | null
  navigationPath: Record<number, string | null>
  navigationSteps: NavigationStep[] | null
  currentStepIndex: number | null
  isNavigating: boolean
  setCurrentLocation: (location: PointOfInterest) => void
  setCurrentLocationById: (id: string) => void
  setDestinationLocation: (location: PointOfInterest) => void
  startNavigation: () => void
  stopNavigation: () => void
  nextNavigationStep: () => void
  previousNavigationStep: () => void
  // Add this property to allow connection to floor plan
  floorPlan: FloorPlan
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

// Inside the NavigationProvider component
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(mockFloorPlans)
  const [currentFloor, setCurrentFloor] = useState<number>(0)
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>(mockPointsOfInterest)
  const [currentLocation, setCurrentLocation] = useState<PointOfInterest | null>(null)
  const [destinationLocation, setDestinationLocation] = useState<PointOfInterest | null>(null)
  const [navigationPath, setNavigationPath] = useState<Record<number, string | null>>({})
  const [navigationSteps, setNavigationSteps] = useState<NavigationStep[] | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)

  // Compute the current floor plan
  const floorPlan = floorPlans[currentFloor] || floorPlans[0]

  // Set current location by ID
  const setCurrentLocationById = (id: string) => {
    const poi = pointsOfInterest.find((p) => p.id === id)
    if (poi) {
      setCurrentLocation(poi)
      setCurrentFloor(poi.floor)
    }
  }

  // Start navigation between current and destination locations
  const startNavigation = () => {
    if (!currentLocation || !destinationLocation) return

    // Calculate path between points
    const { paths, steps } = calculatePath(floorPlans, pointsOfInterest, currentLocation, destinationLocation)

    setNavigationPath(paths)
    setNavigationSteps(steps)
    setCurrentStepIndex(0)
    setIsNavigating(true)

    // If the destination is on a different floor, show navigation on the current floor first
    if (currentLocation.floor !== destinationLocation.floor) {
      setCurrentFloor(currentLocation.floor)
    }
  }

  // Stop navigation
  const stopNavigation = () => {
    setNavigationPath({})
    setNavigationSteps(null)
    setCurrentStepIndex(null)
    setDestinationLocation(null)
    setIsNavigating(false)
  }

  // Navigate to next step
  const nextNavigationStep = () => {
    if (navigationSteps && currentStepIndex !== null && currentStepIndex < navigationSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  // Navigate to previous step
  const previousNavigationStep = () => {
    if (navigationSteps && currentStepIndex !== null && currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  // Load floor plan data
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we're using mock data
    setFloorPlans(mockFloorPlans)
    setPointsOfInterest(mockPointsOfInterest)

    // Load saved location from local storage for offline support
    const savedLocation = localStorage.getItem("currentLocation")
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation)
        setCurrentLocation(parsed)
        setCurrentFloor(parsed.floor)
      } catch (e) {
        console.error("Failed to parse saved location")
      }
    }
  }, [])

  // Save current location to local storage when it changes
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem("currentLocation", JSON.stringify(currentLocation))
    }
  }, [currentLocation])

  // Add floorPlan to the context value
  return (
    <NavigationContext.Provider
      value={{
        floorPlans,
        currentFloor,
        setCurrentFloor,
        pointsOfInterest,
        currentLocation,
        destinationLocation,
        navigationPath,
        navigationSteps,
        currentStepIndex,
        isNavigating,
        setCurrentLocation,
        setCurrentLocationById,
        setDestinationLocation,
        startNavigation,
        stopNavigation,
        nextNavigationStep,
        previousNavigationStep,
        floorPlan,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}

