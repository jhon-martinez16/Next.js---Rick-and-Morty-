// Funciones utilitarias puras (sin React). Se pueden usar tanto en
// Server Components como en Client Components.

import type { CharacterGender, CharacterStatus } from "@/interfaces";

// Saca el id numerico del final de una url de la API.
// Ej: "https://rickandmortyapi.com/api/episode/28" -> 28
export function getIdFromUrl(url: string): number | null {
  const partes = url.split("/");
  const id = Number(partes[partes.length - 1]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Convierte una lista de urls en una lista de ids validos
export function getIdsFromUrls(urls: string[]): number[] {
  return urls
    .map(getIdFromUrl)
    .filter((id): id is number => id !== null);
}

// Arma un query string ignorando los valores vacios.
// Ej: { name: "rick", status: "" } -> "?name=rick"
export function buildQueryString(
  params: Record<string, string | number | undefined | null>,
): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && String(valor).trim() !== "") {
      query.set(clave, String(valor).trim());
    }
  });
  const texto = query.toString();
  return texto ? `?${texto}` : "";
}

// Los searchParams de Next pueden venir como string, arreglo o undefined.
// Esta funcion siempre devuelve un string (o undefined) para trabajar comodo.
export function readParam(
  valor: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(valor)) return valor[0];
  return valor;
}

// Convierte el parametro "page" en un numero de pagina valido (minimo 1)
export function readPage(valor: string | string[] | undefined): number {
  const numero = Number(readParam(valor));
  return Number.isInteger(numero) && numero > 0 ? numero : 1;
}

// Valida que el id de una ruta dinamica sea un entero positivo
export function parseId(valor: string): number | null {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

// Traduce el estado del personaje al espanol
export function translateStatus(status: CharacterStatus | string): string {
  const mapa: Record<string, string> = {
    Alive: "Vivo",
    Dead: "Muerto",
    unknown: "Desconocido",
  };
  return mapa[status] ?? status;
}

// Traduce el genero del personaje al espanol
export function translateGender(gender: CharacterGender | string): string {
  const mapa: Record<string, string> = {
    Female: "Femenino",
    Male: "Masculino",
    Genderless: "Sin genero",
    unknown: "Desconocido",
  };
  return mapa[gender] ?? gender;
}

// Convierte "S02E05" en "Temporada 2 - Episodio 5"
export function formatEpisodeCode(code: string): string {
  const coincidencia = /^S(\d+)E(\d+)$/i.exec(code);
  if (!coincidencia) return code;
  return `Temporada ${Number(coincidencia[1])} - Episodio ${Number(coincidencia[2])}`;
}

// Convierte "December 2, 2013" en "2 de diciembre de 2013"
export function formatAirDate(fecha: string): string {
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Une clases de Tailwind ignorando valores falsos (false, undefined, "").
// Es una version minima de la libreria "clsx".
export function cn(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(" ");
}
