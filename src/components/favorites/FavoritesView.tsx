"use client";

// Vista completa de favoritos.
//
// Tiene que ser Client Component porque los datos viven en el localStorage
// del navegador: el servidor no tiene forma de conocerlos.

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Favorite, FavoriteType } from "@/interfaces";
import { useFavorites } from "@/hooks/useFavorites";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { CardGridSkeleton } from "@/components/ui/Skeletons";
import { GlobeIcon, TrashIcon, TvIcon } from "@/components/ui/icons";

// Pestanas disponibles
const pestanas: { value: FavoriteType | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "character", label: "Personajes" },
  { value: "episode", label: "Episodios" },
  { value: "location", label: "Ubicaciones" },
];

// Ruta de detalle segun el tipo de favorito
const rutaDe: Record<FavoriteType, string> = {
  character: "/personajes",
  episode: "/episodios",
  location: "/ubicaciones",
};

const nombreTipo: Record<FavoriteType, string> = {
  character: "Personaje",
  episode: "Episodio",
  location: "Ubicacion",
};

export default function FavoritesView() {
  const hidratado = useHydrated();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [filtro, setFiltro] = useState<FavoriteType | "all">("all");

  // Mientras no estemos en el navegador mostramos un esqueleto
  // (si no, se veria "no tienes favoritos" por un instante)
  if (!hidratado) return <CardGridSkeleton count={4} />;

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="Aun no tienes favoritos"
        message="Toca el corazon en cualquier personaje, episodio o ubicacion para guardarlo aqui. Se guardan en este navegador."
        actionLabel="Explorar personajes"
        actionHref="/personajes"
      />
    );
  }

  const visibles = filtro === "all" ? favorites : favorites.filter((f) => f.type === filtro);
  const contar = (tipo: FavoriteType | "all") =>
    tipo === "all" ? favorites.length : favorites.filter((f) => f.type === tipo).length;

  function vaciar() {
    const mensaje =
      filtro === "all"
        ? "Seguro que quieres borrar todos tus favoritos?"
        : `Seguro que quieres borrar los favoritos de tipo ${nombreTipo[filtro].toLowerCase()}?`;
    if (window.confirm(mensaje)) clearFavorites(filtro === "all" ? undefined : filtro);
  }

  return (
    <div>
      {/* Pestanas para filtrar por tipo + boton de vaciar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Tipo de favorito" className="flex gap-2 overflow-x-auto pb-1">
          {pestanas.map((p) => (
            <button
              key={p.value}
              type="button"
              role="tab"
              aria-selected={filtro === p.value}
              onClick={() => setFiltro(p.value)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                filtro === p.value
                  ? "border-portal bg-portal text-fondo"
                  : "border-borde bg-superficie text-texto hover:border-portal",
              )}
            >
              {p.label} ({contar(p.value)})
            </button>
          ))}
        </div>

        {visibles.length > 0 && (
          <button
            type="button"
            onClick={vaciar}
            className="flex items-center gap-2 self-start text-sm text-apagado transition hover:text-muerto sm:self-auto"
          >
            <TrashIcon width={16} height={16} />
            Vaciar {filtro === "all" ? "todo" : "esta categoria"}
          </button>
        )}
      </div>

      {visibles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-borde p-8 text-center text-apagado">
          No tienes favoritos en esta categoria.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((fav) => (
            <FavoriteItem key={`${fav.type}-${fav.id}`} favorite={fav} onRemove={removeFavorite} />
          ))}
        </ul>
      )}
    </div>
  );
}

// Fila de un favorito. Se deja en el mismo archivo porque solo se usa aqui.
function FavoriteItem({
  favorite,
  onRemove,
}: {
  favorite: Favorite;
  onRemove: (id: number, type: FavoriteType) => void;
}) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-borde bg-superficie p-3 transition hover:border-portal/60">
      <Link href={`${rutaDe[favorite.type]}/${favorite.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        {/* Imagen para personajes, icono para episodios y ubicaciones */}
        {favorite.image ? (
          <Image
            src={favorite.image}
            alt={`Imagen de ${favorite.name}`}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <span
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl",
              favorite.type === "episode" ? "bg-portal/15 text-portal" : "bg-cian/15 text-cian",
            )}
          >
            {favorite.type === "episode" ? <TvIcon /> : <GlobeIcon />}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-apagado">{nombreTipo[favorite.type]}</p>
          <p className="truncate font-semibold text-texto">{favorite.name}</p>
          <p className="truncate text-sm text-apagado">{favorite.subtitle}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => onRemove(favorite.id, favorite.type)}
        aria-label={`Quitar ${favorite.name} de favoritos`}
        title="Quitar de favoritos"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-borde text-apagado transition hover:border-muerto hover:text-muerto"
      >
        <TrashIcon width={18} height={18} />
      </button>
    </li>
  );
}
