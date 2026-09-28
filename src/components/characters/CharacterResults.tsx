// Resultados de personajes (Server Component asincrono).
//
// Se separa de la pagina para envolverlo en <Suspense>: asi el encabezado y
// los filtros se muestran de inmediato y los resultados llegan en "streaming"
// cuando la API responde.

import type { CharacterFilters } from "@/interfaces";
import { getCharacters } from "@/services";
import CharacterGrid from "./CharacterGrid";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import ResultsCount from "@/components/ui/ResultsCount";

export default async function CharacterResults({ filters }: { filters: CharacterFilters }) {
  const data = await getCharacters(filters);

  // La API responde 404 cuando nada coincide con los filtros
  if (!data || data.results.length === 0) {
    return (
      <EmptyState
        title="No encontramos personajes"
        message="Ningun personaje coincide con esos filtros en esta dimension. Prueba con otros valores."
        actionLabel="Ver todos los personajes"
        actionHref="/personajes"
      />
    );
  }

  // Quitamos "page" para que la paginacion la agregue ella misma
  const { page = 1, ...filtrosActivos } = filters;

  return (
    <>
      <ResultsCount total={data.info.count} singular="personaje encontrado" plural="personajes encontrados" />
      <CharacterGrid characters={data.results} />
      <Pagination
        currentPage={page}
        totalPages={data.info.pages}
        basePath="/personajes"
        params={filtrosActivos}
      />
    </>
  );
}
