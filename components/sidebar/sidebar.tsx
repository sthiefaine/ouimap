"use client";
import { useGeneralSelectorStore } from "@/store/generalStore";
import { useShallow } from "zustand/shallow";
import { ChangeEvent, useEffect, useRef } from "react";
import { useDebounceValue } from "usehooks-ts";
import PaginationComponent from "../pagination/pagination";
import { usePathname, useSearchParams } from "next/navigation";

import {
  CornerDownLeft,
  ExternalLink,
  Eye,
  Mail,
  MapPin,
  Search,
} from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const {
    setMapCoordinates,
    searchQuery,
    setSearchQuery,
    setSelectedPoi,
    weMapData,
    filteredPois,
    selectedPoi,
    setBackToList,
    currentPage,
    setCurrentPage,
    numberBasePois,
  } = useGeneralSelectorStore(
    useShallow((state) => ({
      poisData: state.poisData,
      setMapCoordinates: state.setMapCoordinates,
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      setSelectedPoi: state.setSelectedPoi,
      weMapData: state.weMapData,
      setWeMapData: state.setWeMapData,
      filteredPois: state.filteredPois,
      setFilteredPois: state.setFilteredPois,
      selectedPoi: state.selectedPoi,
      setOptionZoom: state.setOptionZoom,
      setBackToList: state.setBackToList,
      backToList: state.backToList,
      currentPage: state.currentPage,
      setCurrentPage: state.setCurrentPage,
      numberBasePois: state.numberBasePois,
    }))
  );

  const [debouncedValue, setValue] = useDebounceValue("", 500);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/page\/(\d+)/); // Ex: #/page/2
      if (match) {
        setCurrentPage(parseInt(match[1], 10));
      } else {
        setCurrentPage(1);
      }
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = 0;
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname, searchParams, setCurrentPage]);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  useEffect(() => {
      searchInputRef?.current?.focus();
  }, [filteredPois]);

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

  const handleReturnToList = () => {
    setBackToList(true);
    setSelectedPoi(null);
  };

  const DisplayScrollArea = () => {
    return (
      <ScrollArea viewportRef={scrollAreaRef} className="h-full w-full p-3">
        <div>
          {filteredPois?.map((poi, index) => (
            <div
              key={index}
              className="w-full mb-2 flex h-fit items-start justify-start gap-2 p-2 cursor-pointer hover:bg-slate-100 flex-col border-slate-900 border-2 rounded-lg"
              onClick={() => setSelectedPoi(poi)}
            >
              <div className="flex gap-4 items-center text-left max-w-[200px]">
                <Avatar>
                  <AvatarImage src={poi.image} />
                  <AvatarFallback>
                    {poi.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="font-medium">{poi.name}</div>
                  <div className="text-sm text-muted-foreground ">
                    {poi.address}
                  </div>
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
    );
  };

  const DisplayPagination = () => {
    return (
      <PaginationComponent
        currentPage={currentPage}
        totalPages={Math.ceil(weMapData.count / 10)}
      />
    );
  };

  const DisplaySelectedPoi = () => {
    if (!selectedPoi) return null;
    return (
      <>
        <div className="w-full p-1 mb-2 text-center text-sl">
          <Button
            className="flex min-w-[120px] items-start justify-start gap-2 bg-blue-400"
            onClick={handleReturnToList}
          >
            <CornerDownLeft /> Retour à la liste
          </Button>
        </div>
        <div className="w-full mb-2 flex h-fit items-start justify-start gap-2 p-2 cursor-pointer hover:bg-slate-100 flex-col border-slate-900 border-2 rounded-lg">
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
            <div className="flex gap-4 items-center text-left max-w-[200px]">
              <Avatar>
                <AvatarImage src={selectedPoi.image} />
                <AvatarFallback>
                  {selectedPoi.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="font-medium">{selectedPoi.name}</div>
                <div className="text-sm text-muted-foreground ">
                  {selectedPoi.address}
                </div>
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
      </>
    );
  };

  // Maybe look for a better way to do this with viewport optimization for long list
  // https://medium.com/@ashutosh7246/supercharge-your-reactjs-app-with-optimized-infinite-scrolling-3bcf7fc9dffb
  // https://dev.to/usman_awan_003/optimizing-react-performance-with-virtualization-a-developers-guide-3j14
  // https://grafikart.fr/tutoriels/intersection-observer-804

  const DisplaySideBarSearch = () => {
    return (
      <>
        <div className="relative w-full max-w-md pb-2 pt-2 pl-2 pr-2 flex items-center">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            className="pl-8"
            placeholder="Search locations..."
            defaultValue={searchQuery}
            onChange={(e) => handleSearch(e)}
          />
        </div>
        <div className="p-1 mb-2 text-center text-sl text-blue-400">
          {weMapData.count + numberBasePois === 0 && (
            <div className="text-center">Aucun résultat</div>
          )}
          {weMapData.count + numberBasePois === 1 && (
            <div className="text-center">
              {filteredPois.length} élement trouvé
            </div>
          )}
          {weMapData.count + numberBasePois > 1 && (
            <div className="text-center">
              {weMapData.count + numberBasePois} élements trouvés
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="hidden w-[20vw] min-w-[320px] max-w-[500px]  border-r bg-white md:block p-1 pb-60 ">
      {selectedPoi && (
        <>
          {" "}
          <DisplaySelectedPoi />
        </>
      )}
      {!selectedPoi && (
        <>
          <DisplaySideBarSearch />
          <DisplayScrollArea />
          <DisplayPagination />
        </>
      )}
    </div>
  );
}
