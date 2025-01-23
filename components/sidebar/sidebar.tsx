"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Eye, Mail, MapPin, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useGeneralSelectorStore } from "@/store/generalStore";
import { useShallow } from "zustand/shallow";
import { ChangeEvent, useEffect, useState } from "react";

import { useDebounceValue } from "usehooks-ts";
import { PointPoiType } from "@/types/pointPois";

export function Sidebar() {
  const {
    poisData,
    setMapCoordinates,
    searchQuery,
    setSearchQuery,
    setSelectedPoi,
  } = useGeneralSelectorStore(
    useShallow((state) => ({
      poisData: state.poisData,
      setMapCoordinates: state.setMapCoordinates,
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      setSelectedPoi: state.setSelectedPoi,
    }))
  );

  const [debouncedValue, setValue] = useDebounceValue("", 500);
  const [filteredPois, setFilteredPois] = useState<PointPoiType[]>([]);

  useEffect(() => {
    setFilteredPois(poisData);
  }, [poisData]);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  useEffect(() => {
    const filteredItems = poisData.filter(
      (poi) =>
        poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredPois(filteredItems);
  }, [poisData, searchQuery]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSetMapCoordinates = (coordinates: number[]) => {
    setMapCoordinates(coordinates);
  };

  const handleVisiteWebsite = (url: string) => {
    window.open(url, "_blank");
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  // Maybe look for a better way to do this with viewport optimization for long list
  // https://medium.com/@ashutosh7246/supercharge-your-reactjs-app-with-optimized-infinite-scrolling-3bcf7fc9dffb
  // https://dev.to/usman_awan_003/optimizing-react-performance-with-virtualization-a-developers-guide-3j14
  // https://grafikart.fr/tutoriels/intersection-observer-804

  return (
    <div className="hidden w-[300px] border-r bg-white md:block">
      <div className="relative w-full max-w-md pb-2 pt-2 pl-2 pr-2 flex items-center">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search locations..."
          defaultValue={searchQuery}
          onChange={(e) => handleSearch(e)}
        />
      </div>

      <div className="p-1 mb-2 text-center text-sl text-blue-400">
        {filteredPois.length === 0 && (
          <div className="text-center">Aucun résultat</div>
        )}
        {filteredPois.length === 1 && (
          <div className="text-center">
            {filteredPois.length} élement trouvé
          </div>
        )}
        {filteredPois.length > 1 && (
          <div className="text-center">
            {filteredPois.length} élements trouvés
          </div>
        )}
      </div>
      <ScrollArea className="h-full">
        <div className="p-1 pb-20">
          {filteredPois?.map((poi, index) => (
            <div
              key={index}
              className="mb-2 flex h-fit items-start justify-start gap-2 p-2 cursor-pointer hover:bg-slate-100 flex-col border-slate-100"
              onClick={() => setSelectedPoi(poi)}
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <div className="text-left max-w-[200px]">
                <div className="font-medium">{poi.name}</div>
                <div className="text-sm text-muted-foreground ">
                  {poi.address}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex flex-row flex-wrap gap-2">
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
                  <Button
                    variant="outline"
                    className="flex min-w-[120px] items-start justify-start gap-2 p-2"
                    title="Envoyer un email"
                    onClick={() => handleEmail(poi.email)}
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    className="flex min-w-[120px] items-start justify-start gap-2 p-2"
                    title="Visiter le site sur un autre onglet"
                    onClick={() => handleVisiteWebsite(poi.website)}
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    Site internet
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
