// Estructura de un episodio tal cual la devuelve /api/episode
export interface Episode {
  id: number;
  name: string;
  air_date: string; // fecha de emision en texto, ej: "December 2, 2013"
  episode: string; // codigo del episodio, ej: "S01E01"
  characters: string[]; // urls de los personajes que aparecen
  url: string;
  created: string;
}

// Filtros soportados por el endpoint de episodios
export interface EpisodeFilters {
  page?: number;
  name?: string;
  episode?: string; // acepta coincidencias parciales, ej: "S02" trae toda la temporada 2
}
