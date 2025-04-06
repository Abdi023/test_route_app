import { NavigationProvider } from "@/context/navigation-context"
import NavigationSystem from "@/components/navigation-system"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <NavigationProvider>
        <NavigationSystem />
      </NavigationProvider>
    </main>
  )
}

