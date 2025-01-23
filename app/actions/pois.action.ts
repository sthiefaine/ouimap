"use server";

import { jobApplicant, WemapOfficesPois } from "../../data/data";

/* const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL || `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;
 */

// fetching api with fake data faill in production
export async function getAllPois() {
  const data = [...WemapOfficesPois, jobApplicant];
  return data;
}