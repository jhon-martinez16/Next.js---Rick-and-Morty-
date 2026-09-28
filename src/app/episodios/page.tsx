// Listado de episodios: /episodios?name=pilot&episode=S01
//
// Server Component dinamico. Trae la primera pagina en el servidor y la
// entrega a un Client Component que carga el resto con SCROLL INFINITO.

import type { Metadata } from "next";
import { Suspense } from "react";
import type { EpisodeFilters as Filtros, SearchParams } from "@/interfaces";
import { readParam } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import EpisodeFilters from "@/components/episodes/EpisodeFilters";
import EpisodeResults from "@/components/episodes/EpisodeResults";
import { CardGridSkeleton, FiltersSkeleton } from "@/components/ui/Skeletons";

export const metadata: Metadata = {
  title: "Episodios",
  description: "Todos los episodios de Rick and Morty con busqueda por nombre y temporada.",
};

export default async function EpisodiosPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  // En esta seccion no se usa "page": la paginacion la maneja el scroll infinito
  const filtros: Omit<Filtros, "page"> = {
    name: readParam(params.name),
    episode: readParam(params.episode),
  };

  return (
    <>
      <PageHeader
        eyebrow="Seccion 2"
        title="Episodios"
        description="Recorre todas las temporadas. Baja hasta el final de la lista y se cargaran mas episodios automaticamente."
      />

      <Suspense fallback={<FiltersSkeleton />}>
        <EpisodeFilters />
      </Suspense>

      <Suspense key={JSON.stringify(filtros)} fallback={<CardGridSkeleton withImage={false} />}>
        <EpisodeResults filters={filtros} />
      </Suspense>
    </>
  );
}
