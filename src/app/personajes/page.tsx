// Listado de personajes: /personajes?name=rick&status=alive&page=2
//
// Server Component DINAMICO: se renderiza en cada peticion porque depende de
// los searchParams (filtros y pagina). La consulta a la API ocurre en el
// servidor, por lo que el navegador recibe el HTML ya armado.

import type { Metadata } from "next";
import { Suspense } from "react";
import type { CharacterFilters as Filtros, SearchParams } from "@/interfaces";
import { readPage, readParam } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import CharacterFilters from "@/components/characters/CharacterFilters";
import CharacterResults from "@/components/characters/CharacterResults";
import { CardGridSkeleton, FiltersSkeleton } from "@/components/ui/Skeletons";

export const metadata: Metadata = {
  title: "Personajes",
  description: "Listado de personajes de Rick and Morty con filtros por estado, especie, genero y tipo.",
};

export default async function PersonajesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  // Normalizamos los parametros de la URL a nuestro tipo de filtros
  const filtros: Filtros = {
    page: readPage(params.page),
    name: readParam(params.name),
    status: readParam(params.status),
    species: readParam(params.species),
    type: readParam(params.type),
    gender: readParam(params.gender),
  };

  return (
    <>
      <PageHeader
        eyebrow="Seccion 1"
        title="Personajes"
        description="Todos los habitantes del multiverso. Usa los filtros para encontrar a quien buscas y entra a su ficha para ver en que episodios aparece."
      />

      {/* Los filtros usan useSearchParams, por eso van dentro de Suspense */}
      <Suspense fallback={<FiltersSkeleton />}>
        <CharacterFilters />
      </Suspense>

      {/* La key cambia con los filtros: asi React vuelve a mostrar el esqueleto
          mientras llegan los nuevos resultados (streaming) */}
      <Suspense key={JSON.stringify(filtros)} fallback={<CardGridSkeleton />}>
        <CharacterResults filters={filtros} />
      </Suspense>
    </>
  );
}
