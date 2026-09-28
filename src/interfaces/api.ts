// Tipos genericos que comparten todas las respuestas de la Rick and Morty API.
// La API siempre responde los listados con la misma forma: { info, results }.

// Bloque "info" que viene en cada listado paginado
export interface ApiInfo {
  count: number; // total de registros que coinciden con el filtro
  pages: number; // total de paginas disponibles
  next: string | null; // url de la siguiente pagina (null si es la ultima)
  prev: string | null; // url de la pagina anterior (null si es la primera)
}

// Respuesta generica de un listado. T puede ser Character, Episode o Location
export interface ApiResponse<T> {
  info: ApiInfo;
  results: T[];
}

// Referencia corta que usa la API para enlazar recursos (origen, ubicacion, etc.)
export interface ResourceLink {
  name: string;
  url: string;
}

// Parametros que reciben las paginas del App Router.
// Desde Next 15 params y searchParams llegan como Promesas.
export type IdParams = Promise<{ id: string }>;
export type SearchParams = Promise<Record<string, string | string[] | undefined>>;
