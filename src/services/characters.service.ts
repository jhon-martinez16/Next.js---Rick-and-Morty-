// Servicio de personajes: todas las consultas al endpoint /character
import type { ApiResponse, Character, CharacterFilters } from "@/interfaces";
import { buildQueryString } from "@/lib/utils";
import { apiFetch, apiFetchMany } from "./api";

// Lista paginada de personajes con filtros opcionales.
// Si ningun personaje coincide devuelve null.
export function getCharacters(filtros: CharacterFilters = {}) {
  const query = buildQueryString({ ...filtros });
  return apiFetch<ApiResponse<Character>>(`/character${query}`);
}

// Un solo personaje por id. Devuelve null si no existe.
export function getCharacterById(id: number) {
  return apiFetch<Character>(`/character/${id}`);
}

// Varios personajes en una sola peticion (se usa en el detalle de
// episodios y ubicaciones para pintar el reparto / los residentes)
export function getCharactersByIds(ids: number[]) {
  return apiFetchMany<Character>("character", ids);
}
