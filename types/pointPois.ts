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