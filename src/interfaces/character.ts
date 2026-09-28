import type { ResourceLink } from "./api";

// Valores exactos que acepta la API en el filtro "status"
export type CharacterStatus = "Alive" | "Dead" | "unknown";

// Valores exactos que acepta la API en el filtro "gender"
export type CharacterGender = "Female" | "Male" | "Genderless" | "unknown";

// Estructura de un personaje tal cual la devuelve /api/character
export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string; // subespecie, muchas veces viene vacio
  gender: CharacterGender;
  origin: ResourceLink; // lugar de origen
  location: ResourceLink; // ultima ubicacion conocida
  image: string; // avatar de 300x300
  episode: string[]; // urls de los episodios donde aparece
  url: string;
  created: string;
}

// Filtros soportados por el endpoint de personajes
export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}
