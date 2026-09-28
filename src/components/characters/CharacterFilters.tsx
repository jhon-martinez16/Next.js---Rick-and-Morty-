"use client";

// Filtros de la seccion de personajes.
// Solo describe los campos; la logica vive en el FilterBar generico.

import FilterBar, { type FilterField } from "@/components/filters/FilterBar";
import { GENDER_OPTIONS, SPECIES_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";

const campos: FilterField[] = [
  { type: "text", name: "name", label: "Nombre", placeholder: "Ej: Rick, Morty..." },
  { type: "select", name: "status", label: "Estado", options: STATUS_OPTIONS },
  { type: "select", name: "gender", label: "Genero", options: GENDER_OPTIONS },
  { type: "select", name: "species", label: "Especie", options: SPECIES_OPTIONS },
  { type: "text", name: "type", label: "Tipo / subespecie", placeholder: "Ej: Parasite, Clone..." },
];

export default function CharacterFilters() {
  return <FilterBar fields={campos} />;
}
