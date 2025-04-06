"use client"

import { useState, useEffect } from "react"
import { useNavigation } from "@/context/navigation-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, CornerDownLeft, CornerUpRight, ArrowRight, X, ArrowUp, ArrowDown } from "lucide-react"

export default function NavigationControls() {
  const {
    navigationSteps,
    currentStepIndex,
    nextNavigationStep,
    previousNavigationStep,
    stopNavigation,
    destinationLocation,
    currentFloor,
    setCurrentFloor,
  } = useNavigation()

  const [distanceRemaining, setDistanceRemaining] = useState("0")
  const [estimatedTime, setEstimatedTime] = useState("0")

  // Calculate remaining distance and time
  useEffect(() => {
    if (navigationSteps && currentStepIndex !== null) {
      // In a real app, this would be calculated based on the actual path
      const remainingSteps = navigationSteps.length - currentStepIndex - 1
      const avgStepDistance = 10 // meters
      const distance = remainingSteps * avgStepDistance
      setDistanceRemaining(`${distance}`)

      // Estimate time based on average walking speed (1.4 m/s)
      const timeInSeconds = distance / 1.4
      const timeInMinutes = Math.ceil(timeInSeconds / 60)
      setEstimatedTime(`${timeInMinutes}`)
    }
  }, [navigationSteps, currentStepIndex])

  // Get current step instruction and icon
  const getCurrentStepInstruction = () => {
    if (!navigationSteps || currentStepIndex === null) return null

    const step = navigationSteps[currentStepIndex]
    let icon = <ArrowRight className="h-5 w-5" />

    if (step.direction === "left") {
      icon = <CornerDownLeft className="h-5 w-5" />
    } else if (step.direction === "right") {
      icon = <CornerUpRight className="h-5 w-5" />
    } else if (step.direction === "up") {
      icon = <ArrowUp className="h-5 w-5" />
    } else if (step.direction === "down") {
      icon = <ArrowDown className="h-5 w-5" />
    }

    return { instruction: step.instruction, icon }
  }

  const currentStep = getCurrentStepInstruction()
  const isLastStep = navigationSteps && currentStepIndex === navigationSteps.length - 1

  // Handle floor change in navigation
  useEffect(() => {
    if (navigationSteps && currentStepIndex !== null) {
      const step = navigationSteps[currentStepIndex]
      if (step.targetFloor !== undefined && step.targetFloor !== currentFloor) {
        setCurrentFloor(step.targetFloor)
      }
    }
  }, [currentStepIndex, navigationSteps, currentFloor, setCurrentFloor])

  return (
    <div className="border-t p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Resterende afstand</p>
          <p className="font-medium">{distanceRemaining} meter</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Geschatte tijd</p>
          <p className="font-medium">{estimatedTime} min</p>
        </div>
        <Button variant="ghost" size="icon" onClick={stopNavigation}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Card className="p-4 mb-4 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-3">
          {currentStep?.icon}
          <div className="flex-1">
            <p className="font-medium">{currentStep?.instruction}</p>
            {isLastStep && destinationLocation && (
              <p className="text-sm text-muted-foreground">
                Je bestemming {destinationLocation.name} is aan je{" "}
                {navigationSteps?.[currentStepIndex].direction === "left"
                  ? "linker"
                  : navigationSteps?.[currentStepIndex].direction === "right"
                    ? "rechter"
                    : ""}
                kant
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={previousNavigationStep} disabled={currentStepIndex === 0}>
          Vorige
        </Button>

        <Button onClick={nextNavigationStep} disabled={isLastStep} className="gap-1">
          Volgende
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

