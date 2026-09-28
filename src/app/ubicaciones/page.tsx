// Listado de ubicaciones: /ubicaciones?type=Planet&dimension=C-137&page=2
// Server Component dinamico con paginacion clasica.

import type { Metadata } from "next";
import { Suspense } from "react";
import type { LocationFilters as Filtros, SearchParams } from "@/interfaces";
import { readPage, readParam } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import LocationFilters from "@/components/locations/LocationFilters";
import LocationResults from "@/components/locations/LocationResults";
import { CardGridSkeleton, FiltersSkeleton } from "@/components/ui/Skeletons";

export const metadata: Metadata = {
  title: "Ubicaciones",
  description: "Planetas, estaciones espaciales y dimensiones del universo de Rick and Morty.",
};

export default async function UbicacionesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const filtros: Filtros = {
    page: readPage(params.page),
    name: readParam(params.name),
    type: readParam(params.type),
    dimension: readParam(params.dimension),
  };

  return (
    <>
      <PageHeader
        eyebrow="Seccion 3"
        title="Ubicaciones"
        description="Planetas, estaciones espaciales, microversos y mas. Entra a cada lugar para conocer a sus residentes."
      />

      <Suspense fallback={<FiltersSkeleton />}>
        <LocationFilters />
      </Suspense>

      <Suspense key={JSON.stringify(filtros)} fallback={<CardGridSkeleton withImage={false} />}>
        <LocationResults filters={filtros} />
      </Suspense>
    </>
  );
}
