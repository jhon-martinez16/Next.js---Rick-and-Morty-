"use client";

// Numero de favoritos que se muestra junto al enlace "Favoritos" del menu.
// Se actualiza al instante cuando se agrega o quita un favorito (incluso
// desde otra pestana) gracias a useSyncExternalStore.

import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesCounter() {
  const { total } = useFavorites();

  // En el servidor total siempre es 0, asi que no pintamos nada
  if (total === 0) return null;

  return (
    <span
      className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-portal px-1.5 text-xs font-bold text-fondo"
      aria-label={`${total} favoritos guardados`}
    >
      {total}
    </span>
  );
}
