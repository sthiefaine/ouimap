import { PointPoiType, weMapPinpoint } from "@/types/pointPois";

export enum AdaptPoiKeys {
  WEMAP = "WEMAP",
}

export const adpatPoisObject = (pois: (PointPoiType | weMapPinpoint)[], key: AdaptPoiKeys): PointPoiType[] => {
  if (key === AdaptPoiKeys.WEMAP) {
    return (pois as weMapPinpoint[]).map((poi): PointPoiType => {
      return {
        id: poi.id.toString(),
        name: poi.name,
        address: poi.address,
        phone: poi.phone ?? "",
        website: poi.link_url ?? "",
        email: "",
        image: poi.image_url,
        coordinates: {
          type: "Point",
          lat: poi.latitude,
          lng: poi.longitude,
        },
      };
    });
  }
  return pois as PointPoiType[];
}
