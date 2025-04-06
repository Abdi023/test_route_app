"use client"

import { useState, useEffect } from "react"
import { useNavigation } from "@/context/navigation-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Camera, CameraOff } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const { setCurrentLocationById } = useNavigation()
  const isMobile = useMobile()

  // Mock QR code scanning functionality
  // In a real implementation, you would use a library like react-qr-reader
  const startScanning = async () => {
    setCameraError(null)

    try {
      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasCamera = devices.some((device) => device.kind === "videoinput")

      if (!hasCamera) {
        throw new Error("Geen camera gevonden op dit apparaat")
      }

      setScanning(true)

      // In a real implementation, you would initialize the camera here
      // For this mock, we'll simulate finding a QR code after a delay
      if (process.env.NODE_ENV === "development") {
        setTimeout(() => {
          handleScan("POI-1") // Mock QR code value
        }, 3000)
      }
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : "Kan geen toegang krijgen tot camera")
      setScanning(false)
    }
  }

  const stopScanning = () => {
    setScanning(false)
  }

  const handleScan = (data: string | null) => {
    if (data) {
      setLastScanned(data)
      setScanning(false)

      // Process the QR code data
      // Format expected: POI-{id}
      if (data.startsWith("POI-")) {
        const poiId = data.substring(4)
        setCurrentLocationById(poiId)
      }
    }
  }

  // Clean up camera when component unmounts
  useEffect(() => {
    return () => {
      if (scanning) {
        stopScanning()
      }
    }
  }, [scanning])

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>Scan een QR-code om je huidige locatie te bepalen</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="aspect-square bg-muted rounded-md overflow-hidden relative flex items-center justify-center">
            {scanning ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* This would be replaced with actual camera feed */}
                  <div className="w-full h-full bg-black/90 flex items-center justify-center">
                    <div className="relative">
                      {/* Scanning animation */}
                      <div className="w-48 h-48 border-2 border-primary relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-scan"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-white">Scannen...</div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                  onClick={stopScanning}
                >
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Scannen
                </Button>
              </>
            ) : (
              <div className="text-center p-8">
                {cameraError ? (
                  <div className="text-destructive">
                    <p className="font-medium">Camera Fout</p>
                    <p className="text-sm mt-2">{cameraError}</p>
                  </div>
                ) : (
                  <>
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isMobile
                        ? "Tik op de knop hieronder om een QR-code te scannen"
                        : "Plaats de QR-code voor je camera"}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {lastScanned && !scanning && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Laatst gescande code:</p>
              <p className="text-xs font-mono">{lastScanned}</p>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={startScanning} disabled={scanning}>
            <Camera className="h-4 w-4 mr-2" />
            {scanning ? "Scannen..." : "Start Scannen"}
          </Button>
        </CardFooter>
      </Card>

      {/* For development: Mock QR codes */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 border rounded-md p-4 w-full max-w-md">
          <h3 className="text-sm font-medium mb-2">Ontwikkeling: Test QR Codes</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleScan("POI-1")}>
              Hoofdingang
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleScan("POI-2")}>
              Ruimtelijk vormgever
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleScan("POI-3")}>
              Immersive designer
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleScan("POI-4")}>
              E-commerce designer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

