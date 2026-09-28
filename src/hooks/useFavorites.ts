"use client";

// Hook para leer y modificar los favoritos desde cualquier Client Component.
// Internamente usa useSyncExternalStore sobre el store de localStorage.

import { useCallback, useSyncExternalStore } from "react";
import type { Favorite, FavoriteType } from "@/interfaces";
import {
  addFavorite,
  clearFavorites,
  getServerSnapshot,
  getSnapshot,
  removeFavorite,
  subscribe,
} from "@/lib/favorites-store";

export function useFavorites() {
  // Cada vez que cambie localStorage este valor se actualiza solo
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Pregunta si un elemento ya esta en favoritos
  const isFavorite = useCallback(
    (id: number, type: FavoriteType) =>
      favorites.some((f) => f.id === id && f.type === type),
    [favorites],
  );

  // Agrega o quita segun el estado actual
  const toggleFavorite = useCallback(
    (item: Omit<Favorite, "addedAt">) => {
      if (isFavorite(item.id, item.type)) {
        removeFavorite(item.id, item.type);
      } else {
        addFavorite(item);
      }
    },
    [isFavorite],
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    total: favorites.length,
  };
}
