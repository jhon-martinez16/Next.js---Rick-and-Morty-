// Tipos de recurso que se pueden guardar como favorito
export type FavoriteType = "character" | "episode" | "location";

// Lo que guardamos en localStorage por cada favorito.
// Solo se guarda lo necesario para pintar la tarjeta sin volver a llamar a la API.
export interface Favorite {
  id: number;
  type: FavoriteType;
  name: string;
  image?: string; // solo los personajes tienen imagen
  subtitle: string; // texto corto de apoyo (especie, codigo de episodio, tipo de lugar)
  addedAt: number; // fecha en milisegundos, sirve para ordenar
}
