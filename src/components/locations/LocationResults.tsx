// Resultados de ubicaciones con paginacion clasica (Server Component asincrono)
import type { LocationFilters } from "@/interfaces";
import { getLocations } from "@/services";
import LocationCard from "./LocationCard";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import ResultsCount from "@/components/ui/ResultsCount";

export default async function LocationResults({ filters }: { filters: LocationFilters }) {
  const data = await getLocations(filters);

  if (!data || data.results.length === 0) {
    return (
      <EmptyState
        title="No encontramos ubicaciones"
        message="Ningun lugar coincide con esos filtros. Prueba con otra dimension o tipo."
        actionLabel="Ver todas las ubicaciones"
        actionHref="/ubicaciones"
      />
    );
  }

  const { page = 1, ...filtrosActivos } = filters;

  return (
    <>
      <ResultsCount total={data.info.count} singular="ubicacion encontrada" plural="ubicaciones encontradas" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.results.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={data.info.pages}
        basePath="/ubicaciones"
        params={filtrosActivos}
      />
    </>
  );
}
