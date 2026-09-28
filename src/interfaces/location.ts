// Estructura de una ubicacion tal cual la devuelve /api/location
export interface Location {
  id: number;
  name: string;
  type: string; // Planet, Space station, Microverse, etc.
  dimension: string;
  residents: string[]; // urls de los personajes que viven alli
  url: string;
  created: string;
}

// Filtros soportados por el endpoint de ubicaciones
export interface LocationFilters {
  page?: number;
  name?: string;
  type?: string;
  dimension?: string;
}
