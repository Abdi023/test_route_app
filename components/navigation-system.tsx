"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FloorPlanViewer from "@/components/floor-plan-viewer"
import QRScanner from "@/components/qr-scanner"
import NavigationControls from "@/components/navigation-controls"
import ProgramsList from "@/components/programs-list"
import { useNavigation } from "@/context/navigation-context"
import { Button } from "@/components/ui/button"
import { MapPin, QrCode, List, Navigation } from "lucide-react"

export default function NavigationSystem() {
  const { currentLocation, destinationLocation, isNavigating, currentFloor, setCurrentFloor } = useNavigation()
  const [activeTab, setActiveTab] = useState("map")

  // Add this effect to switch to navigation tab when navigation starts
  useEffect(() => {
    if (isNavigating) {
      setActiveTab("navigate")
    }
  }, [isNavigating])

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
      <header className="py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/ma-logo.svg" alt="Mediacollege Amsterdam Logo" className="h-8" />
            <div>
              <h1 className="text-xl font-bold text-[#FF0099]">Plattegrond - Open Dag</h1>
              <p className="text-xs text-muted-foreground">Mediacollege Amsterdam</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentFloor === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFloor(0)}
              className={currentFloor === 0 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
              BG
            </Button>
            <Button
              variant={currentFloor === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFloor(1)}
              className={currentFloor === 1 ? "bg-cyan-500 hover:bg-cyan-600" : ""}
            >
              1e
            </Button>
            <Button
              variant={currentFloor === 2 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFloor(2)}
              className={currentFloor === 2 ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              2e
            </Button>
            <Button
              variant={currentFloor === 3 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFloor(3)}
              className={currentFloor === 3 ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              3e
            </Button>
          </div>
        </div>
        {currentLocation && (
          <p className="text-center text-muted-foreground mt-2">Huidige locatie: {currentLocation.name}</p>
        )}
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Plattegrond</span>
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">Scan QR</span>
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Opleidingen</span>
            </TabsTrigger>
            <TabsTrigger value="navigate" className="flex items-center gap-2" disabled={!isNavigating}>
              <Navigation className="h-4 w-4" />
              <span className="hidden sm:inline">Navigeren</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="flex-1 overflow-hidden">
            <FloorPlanViewer />
          </TabsContent>

          <TabsContent value="scan" className="flex-1">
            <QRScanner />
          </TabsContent>

          <TabsContent value="programs" className="flex-1 overflow-auto">
            <ProgramsList />
          </TabsContent>

          <TabsContent value="navigate" className="flex-1 overflow-hidden flex flex-col">
            {isNavigating && (
              <div className="flex-1 flex flex-col">
                <div className="p-4 bg-muted">
                  <p className="font-medium">Navigeren naar: {destinationLocation?.name}</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <FloorPlanViewer showNavigation />
                </div>
                <NavigationControls />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

