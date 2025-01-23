"use client";
import { getRoute } from "@/app/actions/route.action";
import { Button } from "@/components/ui/button";
import { useGeneralSelectorStore } from "@/store/generalStore";
import { Footprints, Trash2 } from "lucide-react";
import { useShallow } from "zustand/shallow";

export function Header() {
  const { setRoute, poisData, setMapCoordinates, route } = useGeneralSelectorStore(
    useShallow((state) => ({
      setRoute: state.setRoute,
      poisData: state.poisData,
      setMapCoordinates: state.setMapCoordinates,
      route: state.route,
    }))
  );

  const fetchRoute = async (
    a: {
      latitude: number;
      longitude: number;
    },
    b: { latitude: number; longitude: number }
  ) => {
    const data = await getRoute(a, b);

    if ( data.coordinates.length > 0) {
      setRoute(data);
      setMapCoordinates([a.longitude, a.latitude]);
    }
  };

  const handleGoToTHeOffice = () => {
    const office = poisData.find((poi) => poi.name === "Wemap Montpellier");
    const people = poisData.find((poi) => poi.name === "Thiefaine");

    if (!office || !people) return;
    fetchRoute(
      {
        latitude: people.coordinates.lat,
        longitude: people.coordinates.lng,
      },
      {
        latitude: office.coordinates.lat,
        longitude: office.coordinates.lng,
      }
    );
  };

  return (
    <header className="h-16 border-b bg-white px-2">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <p className="text-4xl">🗺️ </p>
            <p className="flex">OuiMap</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {route.coordinates.length > 0 &&
          (
            <Button variant="destructive" size="sm" onClick={() => setRoute({
              type: "LineString",
              coordinates: []
            },)}>
              <Trash2 /> Supprimer
            </Button>
          )
          }
          <Button size="sm" disabled={route.coordinates.length !== 0 } onClick={() => handleGoToTHeOffice()}>
            <Footprints />Itineraire bureau
          </Button>

        </div>
      </div>
    </header>
  );
}
