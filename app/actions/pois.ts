"use server";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  `http://localhost:${process.env.PORT || 3000}`;
export async function getAllPois() {
  if (!BASE_URL) {
    throw new Error(
      "BASE_URL is not defined. Check your environment variables."
    );
  }

  const res = await fetch(BASE_URL + `/api/pois`);
  if (!res.ok) {
    throw new Error(`Failed to fetch POIs: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

