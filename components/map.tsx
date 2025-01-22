import { useEffect, useRef, useState } from "react";
import Map, { MapRef, Marker } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import Image from "next/image";
import { useGeneralSelectorStore } from "@/store/generalStore";
import { useShallow } from "zustand/shallow";
import "mapbox-gl/dist/mapbox-gl.css";
import { PointPoiType } from "@/app/api/pois/data";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN;

const MAPBOX_DEFAULT_CENTER = { lat: 41.4134289, lng: 30.8300695 };
const MAPBOX_DEFAULT_CENTER_0 = { lat: 80, lng: 0 };
const MAPBOX_DEFAULT_ZOOM = 0.8;
const MAPBOX_MIN_ZOOM_DISPLAY_POPUP = 8;
const MAPBOX_DEFAULT_STYLE = "mapbox://styles/mapbox/streets-v12";
const MAPBOX_STYLE_OPTIONS = { optimize_value: "?optimize=true" };

export function MapDisplay() {
  const {
    mapCoordinates,
    poisData,
    setMapCoordinates,
    setMapZoom,
    optionZoom,
  } = useGeneralSelectorStore(
    useShallow((state) => ({
      mapCoordinates: state.mapCoordinates,
      poisData: state.poisData,
      setMapCoordinates: state.setMapCoordinates,
      setMapZoom: state.setMapZoom,
      optionZoom: state.optionZoom,
    }))
  );

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapRef = useRef<MapRef | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    popupRef.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: true,
    });

    return () => {
      popupRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({ zoom: optionZoom });
    }
  }, [optionZoom]);

  const handleFlyTo = (lng: number, lat: number) => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: currentZoom >= 12 ? currentZoom : 12,
      });
    }
  };

  useEffect(() => {
    handleFlyTo(mapCoordinates[0], mapCoordinates[1]);
  }, [mapCoordinates]);

  const handleMapZoom = (e: any) => {
    setMapZoom(e.target.getZoom());
  };

  const handleClickOnPoi = (e: any, poi: PointPoiType) => {
    e.originalEvent.stopPropagation();

    setMapCoordinates([e.target._lngLat.lng, e.target._lngLat.lat]);

    // Wait for the map to move before displaying the popup
    const handleMoveEnd = () => {
      if (!mapRef.current || !popupRef.current) return;
      const currentZoom = mapRef.current.getZoom();

      if (currentZoom >= MAPBOX_MIN_ZOOM_DISPLAY_POPUP) {
        const popup = `
            <div>
              <h3 class="font-bold">${poi.name}</h3>
              <p>ID: ${poi.id}</p>
            </div>
          `;

        popupRef.current
          .setOffset(25)
          .setLngLat([poi.coordinates.lng, poi.coordinates.lat])
          .setHTML(popup)
          .addTo(mapRef.current.getMap());
      }

      mapRef.current.getMap().off("moveend", handleMoveEnd);
    };

    mapRef.current?.getMap().on("moveend", handleMoveEnd);
  };

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <div>
      {!isMapLoaded && (
        <>
        <Image
          className="imgMap"
          src="/mapTpl.png"
          alt="Map Placeholder"
          fill={true}
          quality={100}
          priority={true}
          objectFit="cover"
          style={{
            position: "absolute",
            zIndex: 0,
            top: 0,
            left: 0,
          }}
        />
        </>
      )}
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: MAPBOX_DEFAULT_CENTER_0.lng,
          latitude: MAPBOX_DEFAULT_CENTER_0.lat,
          zoom: MAPBOX_DEFAULT_ZOOM,
          padding: { top: 0, right: 0, bottom: 100, left: 0 },
        }}
        mapStyle={`${MAPBOX_DEFAULT_STYLE}${MAPBOX_STYLE_OPTIONS.optimize_value}`}
        onZoom={(e) => handleMapZoom(e)}
        mapboxAccessToken={MAPBOX_TOKEN}
        optimizeForTerrain={true}
         onLoad={() => handleMapLoad()}
        style={{
          opacity: isMapLoaded ? 1 : 0,
        }}
      >
        {poisData?.length > 0 &&
          poisData.map((poi) => (
            <Marker
              key={poi.id}
              longitude={poi.coordinates.lng}
              latitude={poi.coordinates.lat}
              onClick={(e) => handleClickOnPoi(e, poi)}
            />
          ))}
      </Map>
    </div>
  );
}
