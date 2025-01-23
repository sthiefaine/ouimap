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

export interface weMapPinspoint {
  count: number;
  next: string | null;
  previous: string | null;
  results: weMapPinpoint[];
}

export interface weMapPinpoint {
  address: string;
  altitude: number | null;
  author: Author;
  category: number;
  country: string | null;
  created: string;
  description: string;
  external_data: ExternalData;
  extra_media_urls: string[];
  facebook_url: string | null;
  geo_entity_shape: string | null;
  id: number;
  image_url: string;
  latitude: number;
  level: number | null;
  like_count: number;
  link_url: string | null;
  longitude: number;
  media_credits: string;
  media_thumbnail_url: string | null;
  media_type: string;
  media_url: string;
  name: string;
  opening_hours: string | null;
  phone: string | null;
  state: number;
  status: number;
  search_priority: number;
  tags: string[];
  timezone: string | null;
  twitter_url: string | null;
  type: number;
  updated: string;
  user: number;
  location_shape: string | null;
}

interface Author {
  name: string;
  photo_url: string;
}

interface ExternalData {
  id: string;
  phone: string;
  recommends: string;
  xiti_label: string;
  premium_card: string;
}