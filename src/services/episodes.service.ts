// Servicio de episodios: todas las consultas al endpoint /episode
import type { ApiResponse, Episode, EpisodeFilters } from "@/interfaces";
import { buildQueryString } from "@/lib/utils";
import { apiFetch, apiFetchMany } from "./api";

// Lista paginada de episodios con filtros opcionales.
// Este servicio tambien se usa desde el navegador (scroll infinito).
export function getEpisodes(filtros: EpisodeFilters = {}) {
  const query = buildQueryString({ ...filtros });
  return apiFetch<ApiResponse<Episode>>(`/episode${query}`);
}

// Un solo episodio por id. Devuelve null si no existe.
export function getEpisodeById(id: number) {
  return apiFetch<Episode>(`/episode/${id}`);
}

// Varios episodios a la vez (detalle de un personaje)
export function getEpisodesByIds(ids: number[]) {
  return apiFetchMany<Episode>("episode", ids);
}
