"use client";

// Filtros de la seccion de ubicaciones
import FilterBar, { type FilterField } from "@/components/filters/FilterBar";
import { LOCATION_TYPE_OPTIONS } from "@/lib/constants";

const campos: FilterField[] = [
  { type: "text", name: "name", label: "Nombre", placeholder: "Ej: Earth, Citadel..." },
  { type: "select", name: "type", label: "Tipo", options: LOCATION_TYPE_OPTIONS },
  { type: "text", name: "dimension", label: "Dimension", placeholder: "Ej: C-137, Replacement..." },
];

export default function LocationFilters() {
  return <FilterBar fields={campos} />;
}
