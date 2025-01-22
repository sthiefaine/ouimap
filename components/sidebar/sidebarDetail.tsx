import { useGeneralSelectorStore } from "@/store/generalStore";
import { Button } from "../ui/button";
import { useShallow } from "zustand/shallow";
import {
  CornerDownLeft,
  ExternalLink,
  Mail,
  MapPin,
} from "lucide-react";

export function SidebarDetail() {
  const { selectedPoi, setMapCoordinates, setSelectedPoi } =
    useGeneralSelectorStore(
      useShallow((state) => ({
        selectedPoi: state.selectedPoi,
        setMapCoordinates: state.setMapCoordinates,
        setSelectedPoi: state.setSelectedPoi,
      }))
    );

  const handleSetMapCoordinates = (coordinates: number[]) => {
    setMapCoordinates(coordinates);
  };

  const handleVisiteWebsite = (url: string) => {
    window.open(url, "_blank");
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  if (!selectedPoi) return null;
  return (
    <div className="hidden w-[300px] border-r bg-white md:block">
      <div className="w-full max-w-md pb-2 pt-2 pl-2 pr-2 flex items-center flex-col">
        <div className="w-full p-1 mb-2 text-center text-sl">
          <Button
            className="flex min-w-[120px] items-start justify-start gap-2 bg-blue-400"
            onClick={() => setSelectedPoi(null)}
          >
            <CornerDownLeft /> Retour à la liste
          </Button>
        </div>

        {/* Display the selected poi */}
        <div className="p-1 pb-20 h-full">
          <div
            className="mb-2 flex h-fit items-start justify-start gap-2 p-2 cursor-pointer hover:bg-slate-100 flex-col border-slate-100"
            onClick={() =>
              handleSetMapCoordinates([
                selectedPoi.coordinates.lng,
                selectedPoi.coordinates.lat,
              ])
            }
          >
            <MapPin className="h-4 w-4 shrink-0" />
            <div className="text-left max-w-[200px]">
              <div className="font-medium">{selectedPoi.name}</div>
              <div className="text-sm text-muted-foreground ">
                {selectedPoi.address}
              </div>
            </div>
            <div className="h-full text-sm text-muted-foreground">
              <div className="flex flex-row flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="flex min-w-[120px] justify-start gap-2 p-2"
                  title="Envoyer un email"
                  onClick={() => handleEmail(selectedPoi.email)}
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  className="flex min-w-[120px] justify-start gap-2 p-2"
                  title="Visiter le site sur un autre onglet"
                  onClick={() => handleVisiteWebsite(selectedPoi.website)}
                >
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  Site internet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
