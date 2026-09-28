// Servicio de ubicaciones: todas las consultas al endpoint /location
import type { ApiResponse, Location, LocationFilters } from "@/interfaces";
import { buildQueryString } from "@/lib/utils";
import { apiFetch } from "./api";

// Lista paginada de ubicaciones con filtros opcionales
export function getLocations(filtros: LocationFilters = {}) {
  const query = buildQueryString({ ...filtros });
  return apiFetch<ApiResponse<Location>>(`/location${query}`);
}

// Una sola ubicacion por id. Devuelve null si no existe.
export function getLocationById(id: number) {
  return apiFetch<Location>(`/location/${id}`);
}
