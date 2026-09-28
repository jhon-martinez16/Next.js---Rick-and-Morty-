// Tarjeta de un episodio.
//
// Componente "compartido": no tiene "use client" ni hooks, por lo que puede
// renderizarse en el servidor (detalle de personaje) o dentro de un
// Client Component (lista con scroll infinito) sin cambios.

import Link from "next/link";
import type { Episode } from "@/interfaces";
import { formatAirDate, formatEpisodeCode } from "@/lib/utils";
import FavoriteButton from "@/components/favorites/FavoriteButton";

export default function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-borde bg-superficie p-5 transition hover:-translate-y-1 hover:border-portal/60">
      <Link href={`/episodios/${episode.id}`} className="flex flex-1 flex-col pr-12">
        {/* Codigo del episodio, ej: S01E01 */}
        <span className="w-fit rounded-md bg-portal/15 px-2 py-1 font-mono text-xs font-bold text-portal">
          {episode.episode}
        </span>
        <h2 className="mt-3 text-lg font-semibold text-texto group-hover:text-portal">{episode.name}</h2>
        <p className="mt-1 text-sm text-apagado">{formatEpisodeCode(episode.episode)}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-sm">
          <span className="text-apagado">{formatAirDate(episode.air_date)}</span>
          <span className="text-cian">{episode.characters.length} personajes</span>
        </div>
      </Link>

      <FavoriteButton
        className="absolute right-4 top-4"
        item={{
          id: episode.id,
          type: "episode",
          name: episode.name,
          subtitle: `${episode.episode} - ${episode.air_date}`,
        }}
      />
    </article>
  );
}
