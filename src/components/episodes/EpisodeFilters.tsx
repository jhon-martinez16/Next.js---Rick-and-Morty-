"use client";

// Filtros de la seccion de episodios.
// "episode" acepta coincidencias parciales, por eso "S02" trae la temporada 2 completa.

import FilterBar, { type FilterField } from "@/components/filters/FilterBar";
import { SEASON_OPTIONS } from "@/lib/constants";

const campos: FilterField[] = [
  { type: "text", name: "name", label: "Nombre del episodio", placeholder: "Ej: Pilot, Pickle..." },
  { type: "select", name: "episode", label: "Temporada", options: SEASON_OPTIONS },
];

export default function EpisodeFilters() {
  return <FilterBar fields={campos} />;
}
