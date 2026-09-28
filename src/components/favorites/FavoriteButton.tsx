"use client";

// Boton para agregar o quitar un elemento de favoritos.
//
// Es un Client Component porque necesita onClick y leer localStorage.
// Es la unica parte interactiva de cada tarjeta: la tarjeta en si sigue
// siendo un Server Component (patron "isla de interactividad").

import type { Favorite } from "@/interfaces";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { HeartIcon } from "@/components/ui/icons";

interface FavoriteButtonProps {
  item: Omit<Favorite, "addedAt">;
  variant?: "icon" | "full"; // icono flotante en tarjetas o boton completo en el detalle
  className?: string;
}

export default function FavoriteButton({ item, variant = "icon", className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const activo = isFavorite(item.id, item.type);
  const texto = activo ? "Quitar de favoritos" : "Agregar a favoritos";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggleFavorite(item)}
        aria-pressed={activo}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 font-semibold transition",
          activo
            ? "border-portal bg-portal text-fondo hover:bg-portal-oscuro"
            : "border-borde bg-superficie-2 text-texto hover:border-portal hover:text-portal",
          className,
        )}
      >
        <HeartIcon filled={activo} />
        {texto}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(item)}
      aria-pressed={activo}
      aria-label={`${texto}: ${item.name}`}
      title={texto}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition",
        activo
          ? "border-portal bg-portal text-fondo"
          : "border-white/20 bg-fondo/70 text-texto hover:border-portal hover:text-portal",
        className,
      )}
    >
      <HeartIcon filled={activo} />
    </button>
  );
}
