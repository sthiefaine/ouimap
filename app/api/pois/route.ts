"use server";

import { NextResponse } from "next/server";
import { WemapOfficesPois } from "./data";
import { jobApplicant } from "./data";

export async function GET() {
  const pois = [...WemapOfficesPois, jobApplicant];
  return NextResponse.json(pois);
}
