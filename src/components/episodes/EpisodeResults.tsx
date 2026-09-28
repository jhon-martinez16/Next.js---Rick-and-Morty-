// Resultados de episodios (Server Component asincrono).
// Trae la PRIMERA pagina en el servidor y se la entrega a la lista con
// scroll infinito (Client Component), que se encarga de las siguientes.

import type { EpisodeFilters } from "@/interfaces";
import { getEpisodes } from "@/services";
import EmptyState from "@/components/ui/EmptyState";
import ResultsCount from "@/components/ui/ResultsCount";
import EpisodeInfiniteList from "./EpisodeInfiniteList";

export default async function EpisodeResults({ filters }: { filters: Omit<EpisodeFilters, "page"> }) {
  const data = await getEpisodes({ ...filters, page: 1 });

  if (!data || data.results.length === 0) {
    return (
      <EmptyState
        title="No encontramos episodios"
        message="Ningun episodio coincide con la busqueda. Intenta con otro nombre o temporada."
        actionLabel="Ver todos los episodios"
        actionHref="/episodios"
      />
    );
  }

  return (
    <>
      <ResultsCount total={data.info.count} singular="episodio encontrado" plural="episodios encontrados" />
      {/* key: si cambian los filtros, React crea una lista nueva desde cero */}
      <EpisodeInfiniteList key={JSON.stringify(filters)} initialData={data} filters={filters} />
    </>
  );
}
