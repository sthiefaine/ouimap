"use client";

import { useEffect } from "react";
import { MapDisplay } from "@/components/map/map";
import { MapControls } from "@/components/map/map-controls";
import { Sidebar } from "@/components/sidebar/sidebar";
import { useGeneralSelectorStore } from "@/store/generalStore";
import { useShallow } from "zustand/shallow";
import { SidebarBottom } from "../sidebar/bottom/sidebarBottom";
import { PointPoiType, weMapPinspoint } from "@/types/pointPois";
import { getWeMapPois } from "@/app/actions/pois.action";
import { AdaptPoiKeys, adpatPoisObject } from "@/helpers/adpatPois";

type MapPageClientProps = {
  initialPois: PointPoiType[];
  weMapPois: weMapPinspoint;
};

export function MapPageClient({ initialPois, weMapPois }: MapPageClientProps) {
  const {
    setPoisData,
    setWeMapData,
    searchQuery,
    currentPage,
    weMapData,
    poisData,
    setFilteredPois,
    setNumberBasePois,
  } = useGeneralSelectorStore(
    useShallow((state) => ({
      setPoisData: state.setPoisData,
      selectedPoi: state.selectedPoi,
      setWeMapData: state.setWeMapData,
      weMapData: state.weMapData,
      searchQuery: state.searchQuery,
      currentPage: state.currentPage,
      poisData: state.poisData,
      setFilteredPois: state.setFilteredPois,
      setNumberBasePois: state.setNumberBasePois,
    }))
  );

  useEffect(() => {
    setPoisData(initialPois);
  }, [initialPois, setPoisData]);

  useEffect(() => {
    setWeMapData(weMapPois);
  }, [weMapPois, setWeMapData]);

  useEffect(() => {
    const fetchData = async () => {
      const newData = await getWeMapPois(
        searchQuery,
        currentPage * 10 - 10,
        10
      );
      if (newData !== undefined) {
        setWeMapData(newData ?? {});
      }
    };
    fetchData();
  }, [currentPage, searchQuery, setWeMapData]);

  useEffect(() => {
    const filteredItems = poisData.filter(
      (poi) =>
        poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setNumberBasePois(filteredItems.length);
    const displayBasicPois = currentPage <= 1 ? filteredItems : [];
    // filter complex POI DATA to simple POI DATA
    const adpatPois = adpatPoisObject(weMapData.results, AdaptPoiKeys.WEMAP);

    setFilteredPois([...displayBasicPois, ...adpatPois]);
  }, [
    poisData,
    searchQuery,
    weMapData,
    currentPage,
    setFilteredPois,
    setNumberBasePois,
  ]);

  return (
    <div className="flex relative top-[64px] h-full">
      <div className="relative flex-1">
        <MapDisplay />
        <MapControls />
      </div>
      <Sidebar />
      <SidebarBottom />
    </div>
  );
}
