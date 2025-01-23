"use server";

export async function getRoute(
  a: {
    latitude: number;
    longitude: number;
  },
  b: { latitude: number; longitude: number }
): Promise<GeoJSON.LineString> {
  const start = `${a.longitude},${a.latitude}`;
  const end = `${b.longitude},${b.latitude}`;
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN;

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${accessToken}`;

  const response = await fetch(url);
  const data = await response.json();

  return (
    data.routes[0].geometry ?? {
      type: "LineString",
      coordinates: [],
    }
  );
}
