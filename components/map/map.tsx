import { useEffect, useRef, useState } from "react";
import Map, { Layer, MapRef, Marker, Source } from "react-map-gl";
import mapboxgl, { MapEvent } from "mapbox-gl";
import Image from "next/image";
import { useGeneralSelectorStore } from "@/store/generalStore";
import { useShallow } from "zustand/shallow";
import "mapbox-gl/dist/mapbox-gl.css";
import { PointPoiType } from "@/types/pointPois";
import { getRoute } from "@/app/actions/route.action";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN;
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
    route,
    setRoute,
  } = useGeneralSelectorStore(
    useShallow((state) => ({
      mapCoordinates: state.mapCoordinates,
      poisData: state.poisData,
      setMapCoordinates: state.setMapCoordinates,
      setMapZoom: state.setMapZoom,
      optionZoom: state.optionZoom,
      route: state.route,
      setRoute: state.setRoute,
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

  const handleMapZoom = (e: MapEvent) => {
    setMapZoom(e.target.getZoom());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOnPoi = (e: any, poi: PointPoiType) => {
    e.originalEvent.stopPropagation();

    setMapCoordinates([poi.coordinates.lng, poi.coordinates.lat]);

    // Wait for the map to move before displaying the popup
    const handleMoveEnd = async () => {
      if (!mapRef.current || !popupRef.current) return;
      const currentZoom = mapRef.current.getZoom();

      if (currentZoom >= MAPBOX_MIN_ZOOM_DISPLAY_POPUP) {
        // Générer le contenu HTML du popup
        const popupContent = document.createElement("div");

        // Titre et description
        const title = document.createElement("h3");
        title.className = "font-bold";
        title.textContent = poi.name;

        const description = document.createElement("p");
        description.textContent = `${poi.address}`;

        // add image if exist 100x100
        console.log(poi);
        if (poi.image) {
          const image = document.createElement("img");
          image.src = poi.image;
          image.alt = poi.name;
          popupContent.appendChild(image);
        }

        const button = document.createElement("button");
        button.textContent = "Itineraire bureau";
        button.className = "bg-blue-500 text-white px-3 py-1 rounded mt-2";

        const bureau = poisData.find((p) => p.name === "weMap Montpellier");
        if (!bureau) return;

        const routeData = await getRoute(
          {
            latitude: poi.coordinates.lat,
            longitude: poi.coordinates.lng,
          },
          {
            latitude: bureau.coordinates.lat,
            longitude: bureau.coordinates.lng,
          }
        );

        button.addEventListener("click", () => {
          const route: GeoJSON.LineString = {
            ...routeData,
          };
          setRoute(route);
        });

        // Ajouter les éléments au contenu du popup
        popupContent.appendChild(title);
        popupContent.appendChild(description);

        if (poi.id === "3") {
          popupContent.appendChild(button);
        }

        // Ajouter le popup à la carte
        popupRef.current
          .setOffset(25)
          .setLngLat([poi.coordinates.lng, poi.coordinates.lat])
          .setDOMContent(popupContent)
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
            style={{
              position: "absolute",
              zIndex: 0,
              top: 0,
              left: 0,
              objectFit: "cover",
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
        <>
          {poisData?.length > 0 &&
            poisData.map((poi, index) => (
              <Marker
                key={poi.id + "-" + index}
                longitude={poi.coordinates.lng}
                latitude={poi.coordinates.lat}
                onClick={(e) => handleClickOnPoi(e, poi)}
              />
            ))}

          {route && (
            <Source id="route" type="geojson" data={route}>
              <Layer
                id="route"
                type="line"
                paint={{
                  "line-color": "#007cbf",
                  "line-width": 3,
                }}
              />
            </Source>
          )}
        </>
      </Map>
    </div>
  );
}
