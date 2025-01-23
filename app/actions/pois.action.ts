"use server";

import { weMapPinspoint } from "@/types/pointPois";
import { jobApplicant, weMapOfficesPois } from "../../data/data";
import { getWeMapPoisDefaultMock } from "@/data/general";

/* const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL || `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;
 */

// fetching api with fake data faill in production
export async function getAllPois() {
  const data = [...weMapOfficesPois, jobApplicant];
  return data;
}

export async function getWeMapPois(query: string, offset: number, limit: number) {
  // https://api.getweMap.com/v3.0/pinpoints/search?query=Musee&offset=0&limit=10

  console.log('too',query);
    try {
      const response = await fetch(
        `https://api.getweMap.com/v3.0/pinpoints/search?query=${query}&offset=${offset}&limit=${limit}`
      );
      const data = await response.json();
      return data as weMapPinspoint;
    } catch (error) {
      console.error(error);
      return getWeMapPoisDefaultMock;
    }


}