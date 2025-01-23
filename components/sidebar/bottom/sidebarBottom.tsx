import { useState } from "react";
import styles from "./sidebarBottom.module.css";
import { Eye, Minus } from "lucide-react";
import { useGeneralSelectorStore } from "@/store/generalStore";
import { useShallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";

export function SidebarBottom() {
  const { poisData, setMapCoordinates } = useGeneralSelectorStore(
    useShallow((state) => ({
      poisData: state.poisData,
      setMapCoordinates: state.setMapCoordinates,
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      setSelectedPoi: state.setSelectedPoi,
    }))
  );
  const [isOpen, setIsOpen] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    setStartY(e.touches[0].clientY); // point de départ
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!startY) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;

    if (deltaY > 20) {
      setIsOpen(true);
    } else if (deltaY < -20) {
      setIsOpen(false);
    }
  };

  const handleTouchEnd = () => {
    setStartY(0);
  };

  const handleSetMapCoordinates = (coordinates: number[]) => {
    setMapCoordinates(coordinates);
  };

  return (
    <div className={`${styles.sidebarBottom} ${isOpen ? styles.open : ""}`}>
      <header
        className="w-full flex flex-row align-center justify-start"
        onClick={() => setIsOpen(!isOpen)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full flex justify-center">
          <span className="absolute left-0 pl-5 text-sl text-blue-400">
            {poisData.length === 0 && (
              <p className="text-center">Aucun résultat</p>
            )}
            {poisData.length === 1 && (
              <p className="text-center">{poisData.length} élement</p>
            )}
            {poisData.length > 1 && (
              <p className="text-center">{poisData.length} élements</p>
            )}
          </span>
          <Minus className="w-full flex justify-center" />
        </div>
      </header>

      <>
        {" "}
        {isOpen && (
          <div className=" h-full z-10 flex items-center justify-center gap-1 overflow-y-auto p-5 overflow-auto">
            {poisData?.map((poi) => (
              <div
                key={poi.id}
                className={
                  styles.poiCard +
                  "min-w-[150px] h-[150px] bg-white/50 border-2 border-black/10 rounded-lg flex flex-col items-center justify-start p-1"
                }
              >
                <div className="flex flex-grow flex-col items-start justify-start">
                  <h1 className="text-l font-bold">{poi.name}</h1>
                  <p className="text-xs">{poi.address}</p>
                </div>

                <Button
                  className="flex min-w-[120px] justify-start gap-2 p-2"
                  onClick={() =>
                    handleSetMapCoordinates([
                      poi.coordinates.lng,
                      poi.coordinates.lat,
                    ])
                  }
                >
                  <Eye className="h-4 w-4 shrink-0" />
                  Afficher
                </Button>
              </div>
            ))}
          </div>
        )}
      </>
    </div>
  );
}
