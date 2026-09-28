// Detalle de un episodio: /episodios/[id]  (RUTA DINAMICA)
//
// Como la serie tiene pocos episodios (51) se prerenderizan TODOS en el
// build (SSG). Si se agregan nuevos, se generan bajo demanda (ISR).

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Episode, IdParams } from "@/interfaces";
import { getCharactersByIds, getEpisodeById, getEpisodes } from "@/services";
import { formatAirDate, formatEpisodeCode, getIdsFromUrls, parseId } from "@/lib/utils";
import BackLink from "@/components/ui/BackLink";
import InfoItem from "@/components/ui/InfoItem";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import CharacterGrid from "@/components/characters/CharacterGrid";
import { CardGridSkeleton } from "@/components/ui/Skeletons";

export const revalidate = 86400;

// Recorre todas las paginas de episodios para prerenderizarlos todos.
// Si falla la red durante el build se generan bajo demanda.
export async function generateStaticParams() {
  try {
    const primera = await getEpisodes({ page: 1 });
    if (!primera) return [];

    // Pedimos el resto de paginas en paralelo (2, 3, ...)
    const resto = await Promise.all(
      Array.from({ length: primera.info.pages - 1 }, (_, i) => getEpisodes({ page: i + 2 })),
    );
    const episodios: Episode[] = [primera, ...resto].flatMap((p) => p?.results ?? []);
    return episodios.map((e) => ({ id: String(e.id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: IdParams }): Promise<Metadata> {
  const id = parseId((await params).id);
  const episodio = id ? await getEpisodeById(id) : null;
  if (!episodio) return { title: "Episodio no encontrado" };
  return {
    title: `${episodio.episode} - ${episodio.name}`,
    description: `${episodio.name} (${formatEpisodeCode(episodio.episode)}), emitido el ${formatAirDate(episodio.air_date)}.`,
  };
}

export default async function EpisodioDetallePage({ params }: { params: IdParams }) {
  const id = parseId((await params).id);
  if (!id) notFound();

  // Pedimos el episodio y el listado (para saber el total) en paralelo
  const [episodio, listado] = await Promise.all([getEpisodeById(id), getEpisodes({ page: 1 })]);
  if (!episodio) notFound();
  const totalEpisodios = listado?.info.count ?? episodio.id;

  const personajesIds = getIdsFromUrls(episodio.characters);

  return (
    <article>
      <BackLink href="/episodios" label="Volver a episodios" />

      <header className="fondo-estrellas rounded-3xl border border-borde bg-superficie p-6 sm:p-10">
        <span className="rounded-md bg-portal/15 px-3 py-1.5 font-mono text-sm font-bold text-portal">
          {episodio.episode}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-texto sm:text-5xl">{episodio.name}</h1>

        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          <InfoItem label="Temporada y episodio" value={formatEpisodeCode(episodio.episode)} />
          <InfoItem label="Fecha de emision" value={formatAirDate(episodio.air_date)} />
          <InfoItem label="Personajes" value={String(personajesIds.length)} />
        </dl>

        <FavoriteButton
          variant="full"
          className="mt-6 w-full sm:w-auto"
          item={{
            id: episodio.id,
            type: "episode",
            name: episodio.name,
            subtitle: `${episodio.episode} - ${episodio.air_date}`,
          }}
        />
      </header>

      {/* Navegacion rapida al episodio anterior y siguiente */}
      <nav aria-label="Otros episodios" className="mt-6 flex justify-between gap-3 text-sm">
        {episodio.id > 1 ? (
          <Link href={`/episodios/${episodio.id - 1}`} className="text-apagado hover:text-portal">
            Episodio anterior
          </Link>
        ) : (
          <span />
        )}
        {episodio.id < totalEpisodios && (
          <Link href={`/episodios/${episodio.id + 1}`} className="text-apagado hover:text-portal">
            Episodio siguiente
          </Link>
        )}
      </nav>

      <section className="mt-10" aria-labelledby="titulo-reparto">
        <h2 id="titulo-reparto" className="mb-4 text-2xl font-bold text-texto">
          Personajes en este episodio
        </h2>
        <Suspense fallback={<CardGridSkeleton count={4} />}>
          <RepartoDelEpisodio ids={personajesIds} />
        </Suspense>
      </section>
    </article>
  );
}

// Reparto del episodio (se carga en streaming)
async function RepartoDelEpisodio({ ids }: { ids: number[] }) {
  const personajes = await getCharactersByIds(ids);
  if (personajes.length === 0) {
    return <p className="text-apagado">No hay personajes registrados en este episodio.</p>;
  }
  return <CharacterGrid characters={personajes} />;
}
