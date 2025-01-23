"use client";
import { useGeneralSelectorStore } from "@/store/generalStore";
import { useShallow } from "zustand/shallow";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { PointPoiType } from "@/types/pointPois";
import { AdaptPoiKeys, adpatPoisObject } from "@/helpers/adpatPois";
import PaginationComponent from "../pagination/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { getWeMapPois } from "@/app/actions/pois.action";

import { ExternalLink, Eye, Mail, MapPin, Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const {
    poisData,
    setMapCoordinates,
    searchQuery,
    setSearchQuery,
    setSelectedPoi,
    weMapData,
    setWeMapData,
  } = useGeneralSelectorStore(
    useShallow((state) => ({
      poisData: state.poisData,
      setMapCoordinates: state.setMapCoordinates,
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      setSelectedPoi: state.setSelectedPoi,
      weMapData: state.weMapData,
      setWeMapData: state.setWeMapData,
    }))
  );

  const [debouncedValue, setValue] = useDebounceValue("", 500);
  const [filteredPois, setFilteredPois] = useState<PointPoiType[]>([]);
  const [numberBasePois, setNumberBasePois] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/page\/(\d+)/); // Ex: #/page/2
      if (match) {
        setPageNumber(parseInt(match[1], 10));
      } else {
        setPageNumber(1);
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
  }, [pathname, searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      const newData = await getWeMapPois(searchQuery, pageNumber * 10 - 10, 10);
      if (newData !== undefined) {
        setWeMapData(newData ?? {});
      }
    };
    fetchData();
  }, [pageNumber, searchQuery, setWeMapData]);

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

    setNumberBasePois(filteredItems.length);
    // filter complex POI DATA to simple POI DATA
    const adpatPois = adpatPoisObject(weMapData.results, AdaptPoiKeys.WEMAP);

    const displayBasicPois = pageNumber <= 1 ? filteredItems : [];

    setFilteredPois([...displayBasicPois, ...adpatPois]);

    scrollTo(0, 0);
  }, [poisData, searchQuery, weMapData, pageNumber]);

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
    <div className="hidden w-[20vw] min-w-[320px] max-w-[500px]  border-r bg-white md:block p-1 pb-60 ">
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

      <ScrollArea viewportRef={scrollAreaRef} className="h-full w-full p-3">
        <div>
          {filteredPois?.map((poi, index) => (
            <div
              key={index}
              className="w-full mb-2 flex h-fit items-start justify-start gap-2 p-2 cursor-pointer hover:bg-slate-100 flex-col border-slate-900 border-2 rounded-lg"
              onClick={() => setSelectedPoi(poi)}
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <div className="flex gap-4 items-center text-left max-w-[200px]">
                <Avatar>
                  <AvatarImage src={poi.image} />
                  <AvatarFallback>{poi.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
      <PaginationComponent
        currentPage={pageNumber}
        totalPages={(weMapData.count + numberBasePois) / 10}
      />
    </div>
  );
}
