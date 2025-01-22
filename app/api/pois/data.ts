export type PointPoiType = {
  id: string
  name: string
  address: string
  phone: string
  website: string
  email: string
  image?: string
  coordinates: {
    type: string
    lat: number
    lng: number
  }
}

export const WemapOfficesPois: PointPoiType[] = [
  {
    id: "1",
    name: "Wemap Paris",
    address: "100 rue La Fayette 75010 Paris France",
    phone: "+33 7 68 74 42 34",
    website: "https://getwemap.com/",
    email: "contact@getwemap.com",
    coordinates: {
      type: "Point",
      lat: 48.856614,
      lng: 2.352222,
    },
  },
  {
    id: "2",
    name: "Wemap Montpellier",
    address: "Parc Club du Millénaire Batiment 23, 34000 Montpellier",
    phone: "+33 7 68 74 42 34",
    website: "https://getwemap.com/",
    email: "contact@getwemap.com",
    image: "office.jpg",
    coordinates: {
      type: "Point",
      lat: 43.608973,
      lng: 3.916851,
    },

  },
]

const CITY_MONTPELLIER_COORDINATES = {
  lat: 43.610705,
  lng: 3.876721,
}

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