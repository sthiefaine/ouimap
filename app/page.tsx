import { Header } from "@/components/header";
import { MapPageClient } from "@/components/map-client";
import { getAllPois } from "./actions/pois";

async function getPois() {
  const res = await getAllPois();
  return res
}

export default async function Page() {
  const pois = await getPois();

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      <Header />
        <MapPageClient initialPois={pois} />
    </main>
  );
}
