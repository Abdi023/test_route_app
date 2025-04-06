"use client"

import { useState } from "react"
import { useNavigation } from "@/context/navigation-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, Search, School, Users, BookOpen } from "lucide-react"
import type { PointOfInterest } from "@/types/navigation"

export default function PointsOfInterestList() {
  const { floorPlan, setCurrentLocation, setDestinationLocation, startNavigation, currentLocation } = useNavigation()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter POIs based on search query and active tab
  const filteredPOIs = floorPlan.pointsOfInterest.filter((poi) => {
    const matchesSearch =
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && poi.category === activeTab
  })

  // Group POIs by category for better organization
  const poiCategories = {
    all: filteredPOIs,
    classroom: filteredPOIs.filter((poi) => poi.category === "classroom"),
    facility: filteredPOIs.filter((poi) => poi.category === "facility"),
    department: filteredPOIs.filter((poi) => poi.category === "department"),
    program: filteredPOIs.filter((poi) => poi.category === "program"),
  }

  const handleSetCurrentLocation = (poi: PointOfInterest) => {
    setCurrentLocation(poi)
  }

  const handleNavigateTo = (poi: PointOfInterest) => {
    if (currentLocation) {
      setDestinationLocation(poi)
      startNavigation()
    } else {
      // If no current location, prompt user to set one first
      alert("Please set your current location first by scanning a QR code or selecting a starting point.")
    }
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search points of interest..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="classroom" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span className="hidden sm:inline">Classes</span>
          </TabsTrigger>
          <TabsTrigger value="facility" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="hidden sm:inline">Facilities</span>
          </TabsTrigger>
          <TabsTrigger value="department" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="hidden sm:inline">Departments</span>
          </TabsTrigger>
          <TabsTrigger value="program" className="flex items-center gap-1">
            <School className="h-3 w-3" />
            <span className="hidden sm:inline">Programs</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(poiCategories).map(([category, pois]) => (
          <TabsContent key={category} value={category} className="flex-1 overflow-auto">
            {pois.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Search className="h-8 w-8 mb-2" />
                <p>No points of interest found</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {pois.map((poi) => (
                  <Card key={poi.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{poi.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {poi.floor ? `Floor ${poi.floor}` : "Ground Floor"} • {poi.category}
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
                        I'm Here
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleNavigateTo(poi)}>
                        <Navigation className="h-3 w-3 mr-1" />
                        Navigate
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

