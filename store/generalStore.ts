"use client";
import { PointPoiType } from "@/types/pointPois";
import { create } from "zustand";

export type GeneralStoreState = {
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  mapIsOpen: boolean;
  mapZoom: number;
  mapCoordinates: number[];
  poisData: PointPoiType[];
  selectedPoi: PointPoiType | null;
  optionZoom: number;
  route: GeoJSON.LineString;
  setRoute: (route: GeoJSON.LineString) => void;
};

export type GeneralStoreActions = {
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (searchQuery: string) => void;
  setMapIsOpen: (isOpen: boolean) => void;
  setMapZoom: (zoom: number) => void;
  setMapCoordinates: (coordinates: number[]) => void;
  setPoisData: (poisData: PointPoiType[]) => void;
  setSelectedPoi: (selectedPoi: PointPoiType | null) => void;
  setOptionZoom: (optionZoom: number) => void;
  setRoute: (route: GeoJSON.LineString) => void;
};

export type GeneralStore = GeneralStoreState & GeneralStoreActions;

export const defaultInitState: GeneralStore = {
  poisData: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  mapIsOpen: false,
  mapZoom: 0,
  mapCoordinates: [0, 0],
  selectedPoi: null,
  optionZoom: 2,
  route: {
    type: "LineString",
    coordinates: []
  },
  setIsLoading: () => null,
  setError: () => null,
  setSearchQuery: () => null,
  setMapIsOpen: () => null,
  setMapZoom: () => null,
  setMapCoordinates: () => {},
  setPoisData: () => null,
  setSelectedPoi: () => null,
  setOptionZoom: () => null,
  setRoute: () => null
};

export const useGeneralSelectorStore = create<GeneralStore>((set) => ({
  ...defaultInitState,
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setMapIsOpen: (isOpen) => set({ mapIsOpen: isOpen }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  setMapCoordinates: (coordinates) => set({ mapCoordinates: coordinates }),
  setPoisData: (poisData) => set({ poisData }),
  setSelectedPoi: (selectedPoi) => set({ selectedPoi }),
  setOptionZoom: (optionZoom) => set({ optionZoom }),
  setRoute: (route) => set({ route })
}));
