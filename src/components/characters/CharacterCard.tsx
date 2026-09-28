// Tarjeta de un personaje.
// Server Component: se renderiza en el servidor y solo el boton de
// favorito (FavoriteButton) se hidrata en el navegador.

import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/interfaces";
import { translateGender, translateStatus } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import FavoriteButton from "@/components/favorites/FavoriteButton";

interface CharacterCardProps {
  character: Character;
  priority?: boolean; // true para las primeras imagenes visibles (mejora el LCP)
}

export default function CharacterCard({ character, priority = false }: CharacterCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-borde bg-superficie transition hover:-translate-y-1 hover:border-portal/60 hover:shadow-lg hover:shadow-portal/10">
      {/* Toda la tarjeta es un enlace a la ruta dinamica /personajes/[id] */}
      <Link href={`/personajes/${character.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-superficie-2">
          <Image
            src={character.image}
            alt={`Imagen de ${character.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            // En Next 16 "priority" esta obsoleto: se usa loading="eager" + fetchPriority
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <StatusBadge status={character.status} className="absolute left-3 top-3" />
        </div>
        <div className="p-4">
          <h2 className="truncate text-lg font-semibold text-texto group-hover:text-portal">
            {character.name}
          </h2>
          <p className="text-sm text-apagado">
            {character.species} - {translateGender(character.gender)}
          </p>
          <p className="mt-3 text-xs uppercase tracking-wider text-apagado">Ultima ubicacion</p>
          <p className="truncate text-sm text-texto">{character.location.name}</p>
        </div>
      </Link>

      {/* El boton va FUERA del <Link> porque un boton dentro de un enlace no es HTML valido */}
      <FavoriteButton
        className="absolute right-3 top-3"
        item={{
          id: character.id,
          type: "character",
          name: character.name,
          image: character.image,
          subtitle: `${character.species} - ${translateStatus(character.status)}`,
        }}
      />
    </article>
  );
}
