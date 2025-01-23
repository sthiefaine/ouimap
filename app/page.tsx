"use server";

import { Header } from "@/components/header/header";
import { MapPageClient } from "@/components/map/map-client";
import { getAllPois } from "./actions/pois.action";

async function getData() {
  const data = await getAllPois();
  if (!data) {
    return [];
  }
  return data;
}

export default async function Page() {
  const pois = await getData();

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      <Header />
      <MapPageClient initialPois={pois} />
    </main>
  );
}
