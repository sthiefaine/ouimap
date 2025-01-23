"use server";

import { NextResponse } from "next/server";
import { weMapOfficesPois } from "../../../data/data";
import { jobApplicant } from "../../../data/data";

export async function GET() {
  const pois = [...weMapOfficesPois, jobApplicant];
  return new NextResponse(JSON.stringify(pois), { headers: { "Content-Type": "application/json" } });
}