"use server";

import { Header } from "@/components/header/header";
import { MapPageClient } from "@/components/map/map-client";
import { getAllPois, getWeMapPois } from "./actions/pois.action";
import { getWeMapPoisDefaultMock } from "@/data/general";

async function getData() {
  const data = await getAllPois();

  const results = [...data];
  if (!results) {
    return [];
  }
  return results;
}

async function getWeMapPoisData() {
  const weMapData = await getWeMapPois("", 0, 10);
  const results = weMapData;
  if (!results) {
    return getWeMapPoisDefaultMock
  }
  return results;
}

export default async function Page() {
  const pois = await getData();
  const weMapPois = await getWeMapPoisData();

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      <Header />
      <MapPageClient initialPois={pois} weMapPois={weMapPois} />
    </main>
  );
}
