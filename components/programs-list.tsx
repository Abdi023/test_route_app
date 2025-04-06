"use client"

import { useState } from "react"
import { useNavigation } from "@/context/navigation-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, Search, Palette, Code, Film, Music, Home, Mic } from "lucide-react"
import type { PointOfInterest } from "@/types/navigation"

export default function ProgramsList() {
  const {
    pointsOfInterest,
    setCurrentLocation,
    setDestinationLocation,
    startNavigation,
    currentLocation,
    setCurrentFloor,
  } = useNavigation()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter POIs based on search query and active tab
  const filteredPOIs = pointsOfInterest.filter((poi) => {
    const matchesSearch =
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && poi.category === activeTab
  })

  // Group POIs by category for better organization
  const poiCategories = {
    all: filteredPOIs,
    algemeen: filteredPOIs.filter((poi) => poi.category === "algemeen"),
    design: filteredPOIs.filter((poi) => poi.category === "design"),
    software: filteredPOIs.filter((poi) => poi.category === "software"),
    media: filteredPOIs.filter((poi) => poi.category === "media"),
    backstage: filteredPOIs.filter((poi) => poi.category === "backstage"),
    av: filteredPOIs.filter((poi) => poi.category === "av"),
  }

  const handleSetCurrentLocation = (poi: PointOfInterest) => {
    setCurrentLocation(poi)
    setCurrentFloor(poi.floor)
  }

  const handleNavigateTo = (poi: PointOfInterest) => {
    if (currentLocation) {
      // Set the destination
      setDestinationLocation(poi)

      // Start navigation immediately
      startNavigation()

      // Switch to the destination floor to show the target
      setCurrentFloor(poi.floor)

      // Automatically switch to navigation tab
      // We need to get access to the activeTab setter from navigation-system.tsx
    } else {
      // If no current location, prompt user to set one first
      alert("Stel eerst je huidige locatie in door een QR-code te scannen of een startpunt te selecteren.")
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "algemeen":
        return <Home className="h-3 w-3" />
      case "design":
        return <Palette className="h-3 w-3" />
      case "software":
        return <Code className="h-3 w-3" />
      case "media":
        return <Mic className="h-3 w-3" />
      case "backstage":
        return <Music className="h-3 w-3" />
      case "av":
        return <Film className="h-3 w-3" />
      default:
        return <Home className="h-3 w-3" />
    }
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Zoek opleidingen..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-7">
          <TabsTrigger value="all">Alle</TabsTrigger>
          <TabsTrigger value="algemeen" className="flex items-center gap-1">
            <Home className="h-3 w-3" />
            <span className="hidden sm:inline">Algemeen</span>
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            <span className="hidden sm:inline">Ontwerpen</span>
          </TabsTrigger>
          <TabsTrigger value="software" className="flex items-center gap-1">
            <Code className="h-3 w-3" />
            <span className="hidden sm:inline">Software</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-1">
            <Mic className="h-3 w-3" />
            <span className="hidden sm:inline">Media</span>
          </TabsTrigger>
          <TabsTrigger value="backstage" className="flex items-center gap-1">
            <Music className="h-3 w-3" />
            <span className="hidden sm:inline">Backstage</span>
          </TabsTrigger>
          <TabsTrigger value="av" className="flex items-center gap-1">
            <Film className="h-3 w-3" />
            <span className="hidden sm:inline">Film</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(poiCategories).map(([category, pois]) => (
          <TabsContent key={category} value={category} className="flex-1 overflow-auto">
            {pois.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Search className="h-8 w-8 mb-2" />
                <p>Geen opleidingen gevonden</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {pois.map((poi) => (
                  <Card key={poi.id} className="border-l-4" style={{ borderLeftColor: poi.color }}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: poi.color }}
                        >
                          {poi.number}
                        </div>
                        <CardTitle className="text-base">{poi.name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        {poi.floor === 0
                          ? "Begane Grond"
                          : poi.floor === 1
                            ? "1e Verdieping"
                            : poi.floor === 2
                              ? "2e Verdieping"
                              : "3e Verdieping"}{" "}
                        • {poi.categoryName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">{poi.description}</p>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSetCurrentLocation(poi)}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Ik ben hier
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleNavigateTo(poi)}>
                        <Navigation className="h-3 w-3 mr-1" />
                        Navigeer
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

