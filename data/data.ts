import { PointPoiType } from "@/types/pointPois"
import { CITY_MONTPELLIER_COORDINATES } from "./general"


export const weMapOfficesPois: PointPoiType[] = [
  {
    id: "1",
    name: "Wemap Paris",
    address: "100 rue La Fayette 75010 Paris France",
    phone: "+33 7 68 74 42 34",
    website: "https://getweMap.com/",
    email: "contact@getweMap.com",
    coordinates: {
      type: "Point",
      lat: 48.877445,
      lng: 2.350321,
    },
  },
  {
    id: "2",
    name: "Wemap Montpellier",
    address: "Parc Club du Millénaire Batiment 23, 34000 Montpellier",
    phone: "+33 7 68 74 42 34",
    website: "https://getweMap.com/",
    email: "contact@getweMap.com",
    image: "office.jpg",
    coordinates: {
      type: "Point",
      lat: 43.608973,
      lng: 3.916851,
    },

  },
]

export const jobApplicant: PointPoiType = {
  id: "3",
  name: "Thiefaine",
  address: "Montpellier",
  phone: "+33 6 58 20 09 18",
  website: "https://thiefaine.dev",
  email: "thiefaine.simonnou@gmail.com",
  coordinates: {
    type: "Point",
    ...CITY_MONTPELLIER_COORDINATES
  },
}