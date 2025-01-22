"use server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
`http://localhost:${process.env.PORT || 3000}`

export async function getAllPois() {
  const res = await fetch(BASE_URL + `/api/pois`);
  const data = await res.json();
  return data;
}