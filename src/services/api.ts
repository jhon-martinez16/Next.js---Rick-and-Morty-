// Cliente base para la Rick and Morty API.
// Todas las peticiones pasan por aqui, asi el manejo de errores y de cache
// se escribe una sola vez y los demas servicios quedan muy cortos.

import { API_URL, REVALIDATE_SECONDS } from "@/lib/constants";

// Error propio para distinguir fallas de la API de otros errores
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Hace un GET a la API y devuelve el JSON tipado.
// - Si la API responde 404 devolvemos null: la API usa 404 tanto para
//   "ese id no existe" como para "ningun resultado coincide con el filtro",
//   y en ambos casos no es un error de la aplicacion.
// - Cualquier otro error se lanza para que lo capture el error.tsx de la ruta.
export async function apiFetch<T>(path: string): Promise<T | null> {
  const respuesta = await fetch(`${API_URL}${path}`, {
    // En el servidor Next guarda la respuesta en su Data Cache y la
    // revalida cada REVALIDATE_SECONDS (ISR). En el navegador esta opcion se ignora.
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (respuesta.status === 404) {
    return null;
  }

  if (!respuesta.ok) {
    throw new ApiError(
      `La API respondio con un error (${respuesta.status})`,
      respuesta.status,
    );
  }

  return (await respuesta.json()) as T;
}

// Cuando se piden varios ids a la vez (/character/1,2,3) la API devuelve un
// arreglo, pero si se pide uno solo devuelve un objeto. Esta funcion
// normaliza la respuesta para que siempre sea un arreglo.
export async function apiFetchMany<T>(
  recurso: string,
  ids: number[],
): Promise<T[]> {
  if (ids.length === 0) return [];

  const datos = await apiFetch<T | T[]>(`/${recurso}/${ids.join(",")}`);
  if (!datos) return [];
  return Array.isArray(datos) ? datos : [datos];
}
