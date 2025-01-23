"use client";
import { useGeneralSelectorStore } from "@/store/generalStore";
import { useShallow } from "zustand/shallow";
import { useEffect, useRef, useState } from "react";
import { CornerDownLeft, ExternalLink, Mail, Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import PaginationComponent from "@/components/pagination/pagination";
import { Button } from "@/components/ui/button";
import { useDebounceValue } from "usehooks-ts";
import styles from "./sidebarBottom.module.css";

export function SidebarBottom() {
  const {
    setMapCoordinates,
    searchQuery,
    setSearchQuery,
    filteredPois,
    selectedPoi,
    setSelectedPoi,
    currentPage,
    weMapData,
    setBackToList,
  } = useGeneralSelectorStore(
    useShallow((state) => ({
      poisData: state.poisData,
      setMapCoordinates: state.setMapCoordinates,
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      filteredPois: state.filteredPois,
      setFilteredPois: state.setFilteredPois,
      selectedPoi: state.selectedPoi,
      setSelectedPoi: state.setSelectedPoi,
      currentPage: state.currentPage,
      setCurrentPage: state.setCurrentPage,
      weMapData: state.weMapData,
      setBackToList: state.setBackToList,
    }))
  );

  const [debouncedValue, setValue] = useDebounceValue("", 500);
  const [isOpen, setIsOpen] = useState(false);
  const [startY, setStartY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    setStartY(e.touches[0].clientY); // point de départ
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!startY) return;
    if (isOpen) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;

    if (deltaY > 20) {
      setIsOpen(true);
    } else if (deltaY < -20) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
    if(debouncedValue.length !== 0) {
      searchInputRef?.current?.focus();
    }
  }, [debouncedValue.length, filteredPois]);

  const handleTouchEnd = () => {
    setStartY(0);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setIsOpen(true);
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
      <ScrollArea
        viewportRef={scrollContainerRef}
        className="scroll-area-horizontal w-full p-3"
      >
        <div className="flex gap-4">
          {filteredPois?.map((poi, index) => (
            <div
              key={index}
              className="min-w-[150px] min-h-[150px] max-w-[150px]: bg-gray-100 flex flex-col justify-center items-center border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => setSelectedPoi(poi)}
            >
              <Avatar>
                <AvatarImage src={poi.image} />
                <AvatarFallback>
                  {poi.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center mt-2">
                <div className="font-medium text-sm">{poi.name}</div>
                <div
                  className="text-xs text-muted-foreground truncate max-w-[150px]"
                  title="poi.address"
                >
                  {poi.address}
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
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
        <div className="w-full p-1 mb-1 text-center text-sl">
          <Button
            className="flex min-w-[120px] items-start justify-start gap-1 bg-blue-400"
            onClick={handleReturnToList}
          >
            <CornerDownLeft /> Retour à la liste
          </Button>
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="w-[80vw] mb-2 flex items-start justify-start gap-2 p-2 cursor-pointer hover:bg-slate-100 flex-col border-slate-900 border-2 rounded-lg">
            <div
              className="mb-2 flex items-start justify-start gap-1 m-4 cursor-pointer hover:bg-slate-100 flex-col border-slate-100"
              onClick={() =>
                handleSetMapCoordinates([
                  selectedPoi.coordinates.lng,
                  selectedPoi.coordinates.lat,
                ])
              }
            >
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
        </div>
      </>
    );
  };

  return (
    <div className={`${styles.sidebarBottom} ${isOpen ? styles.open : ""}`}>
      <header
        className="w-full flex flex-row items-center justify-between px-4 py-2"
        onClick={() => setIsOpen(!isOpen)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-[70vw] max-w-md pb-2 pt-2 pl-2 pr-2 flex items-center">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            className="pl-8"
            placeholder="Rechercher des lieux..."
            defaultValue={searchQuery}
            onChange={handleSearch}
            onClick={(e) => handleSearchClick(e)}
          />
        </div>
        <div className="text-sm text-gray-600 cursor-pointer">
          {isOpen ? "Fermer" : "Ouvrir"}
        </div>
      </header>
      {isOpen && (
        <>
          {selectedPoi && (
            <>
              {" "}
              <DisplaySelectedPoi />
            </>
          )}
          {!selectedPoi && (
            <>
              <div className="flex-grow overflow-hidden">
                <DisplayScrollArea />
              </div>
              <div className="min-h-5">
                <DisplayPagination />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
