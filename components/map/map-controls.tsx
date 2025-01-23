import { Button } from "@/components/ui/button"
import { useGeneralSelectorStore } from "@/store/generalStore"
import { Minus, Plus, Locate } from "lucide-react"
import { useShallow } from "zustand/shallow"

export function MapControls() {

  const { mapZoom, setMapCoordinates, optionZoom, setOptionZoom } = useGeneralSelectorStore(
    useShallow(state => ({
      mapZoom: state.mapZoom,
      setMapCoordinates: state.setMapCoordinates,
      optionZoom: state.optionZoom,
      setOptionZoom: state.setOptionZoom,
    }))
  )

  const handleZoomIn = () => {
    setOptionZoom(Math.floor(mapZoom) + 1)
  }

  const handleZoomOut = () => {
    if (optionZoom <= 1) return
    setOptionZoom(mapZoom - 1)
  }

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position
        setMapCoordinates([coords.longitude, coords.latitude])
      })
    }
  }

  return (
    <div className="absolute top-6 left-4 flex flex-col gap-2">
      <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
        <Minus className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" className="h-8 w-8" onClick={getGeolocation}>
        <Locate className="h-4 w-4" />
      </Button>
    </div>
  )
}

