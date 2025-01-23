"use server";

import { NextResponse } from "next/server";
import { WemapOfficesPois } from "../../../data/data";
import { jobApplicant } from "../../../data/data";

export async function GET() {
  const pois = [...WemapOfficesPois, jobApplicant];
  return new NextResponse(JSON.stringify(pois), { headers: { "Content-Type": "application/json" } });
}
