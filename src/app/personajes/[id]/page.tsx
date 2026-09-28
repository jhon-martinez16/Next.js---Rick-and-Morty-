// Detalle de un personaje: /personajes/[id]  (RUTA DINAMICA)
//
// Estrategia de renderizado:
// - generateStaticParams: en el build se generan de forma estatica (SSG)
//   los personajes de la primera pagina de la API.
// - El resto de ids se generan la primera vez que alguien los visita y se
//   guardan en cache (ISR), revalidandose cada 24 horas.
// - Si el id no existe se muestra la pagina 404 (notFound()).

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { IdParams } from "@/interfaces";
import { getCharacterById, getCharacters, getEpisodesByIds } from "@/services";
import { getIdFromUrl, getIdsFromUrls, parseId, translateGender, translateStatus } from "@/lib/utils";
import BackLink from "@/components/ui/BackLink";
import InfoItem from "@/components/ui/InfoItem";
import StatusBadge from "@/components/ui/StatusBadge";
import FavoriteButton from "@/components/favorites/FavoriteButton";

// Revalidar cada 24 horas (debe ser un numero literal)
export const revalidate = 86400;

// Ids que se prerenderizan en el build (primera pagina = 20 personajes).
// Si la API no responde durante el build devolvemos [] y todas las paginas
// se generan bajo demanda: el build nunca falla por culpa de la red.
export async function generateStaticParams() {
  try {
    const data = await getCharacters({ page: 1 });
    return (data?.results ?? []).map((c) => ({ id: String(c.id) }));
  } catch {
    return [];
  }
}

// Titulo de la pestana con el nombre del personaje (SEO).
// Next reutiliza la misma peticion fetch que hace la pagina (memoizacion).
export async function generateMetadata({ params }: { params: IdParams }): Promise<Metadata> {
  const id = parseId((await params).id);
  const personaje = id ? await getCharacterById(id) : null;
  if (!personaje) return { title: "Personaje no encontrado" };
  return {
    title: personaje.name,
    description: `${personaje.name}: ${personaje.species}, ${translateStatus(personaje.status).toLowerCase()}. Ultima ubicacion: ${personaje.location.name}.`,
    openGraph: { images: [personaje.image] },
  };
}

export default async function PersonajeDetallePage({ params }: { params: IdParams }) {
  const id = parseId((await params).id);
  if (!id) notFound(); // ej: /personajes/abc

  const personaje = await getCharacterById(id);
  if (!personaje) notFound(); // ej: /personajes/99999

  // Ids del origen y la ubicacion para enlazar a /ubicaciones/[id]
  const origenId = personaje.origin.url ? getIdFromUrl(personaje.origin.url) : null;
  const ubicacionId = personaje.location.url ? getIdFromUrl(personaje.location.url) : null;
  const episodiosIds = getIdsFromUrls(personaje.episode);

  return (
    <article>
      <BackLink href="/personajes" label="Volver a personajes" />

      <div className="grid gap-8 rounded-3xl border border-borde bg-superficie p-5 sm:p-8 md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl md:max-w-none">
          <Image
            src={personaje.image}
            alt={`Imagen de ${personaje.name}`}
            fill
            sizes="(max-width: 768px) 320px, 320px"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        </div>

        <div>
          <StatusBadge status={personaje.status} />
          <h1 className="mt-3 text-3xl font-extrabold text-texto sm:text-4xl">{personaje.name}</h1>
          <p className="mt-1 text-apagado">
            {personaje.species}
            {personaje.type && ` - ${personaje.type}`}
          </p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoItem label="Estado" value={translateStatus(personaje.status)} />
            <InfoItem label="Genero" value={translateGender(personaje.gender)} />
            <InfoItem label="Especie" value={personaje.species} />
            <InfoItem label="Tipo" value={personaje.type || "Sin subespecie"} />
            <InfoItem
              label="Origen"
              value={personaje.origin.name}
              href={origenId ? `/ubicaciones/${origenId}` : null}
            />
            <InfoItem
              label="Ultima ubicacion"
              value={personaje.location.name}
              href={ubicacionId ? `/ubicaciones/${ubicacionId}` : null}
            />
          </dl>

          <FavoriteButton
            variant="full"
            className="mt-6 w-full sm:w-auto"
            item={{
              id: personaje.id,
              type: "character",
              name: personaje.name,
              image: personaje.image,
              subtitle: `${personaje.species} - ${translateStatus(personaje.status)}`,
            }}
          />
        </div>
      </div>

      {/* Los episodios se cargan en streaming: la ficha se ve de inmediato
          y la lista aparece cuando termina la segunda consulta */}
      <section className="mt-10" aria-labelledby="titulo-episodios">
        <h2 id="titulo-episodios" className="mb-4 text-2xl font-bold text-texto">
          Aparece en {episodiosIds.length} {episodiosIds.length === 1 ? "episodio" : "episodios"}
        </h2>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-superficie" />}>
          <EpisodiosDelPersonaje ids={episodiosIds} />
        </Suspense>
      </section>
    </article>
  );
}

// Lista compacta de episodios del personaje (Server Component asincrono)
async function EpisodiosDelPersonaje({ ids }: { ids: number[] }) {
  const episodios = await getEpisodesByIds(ids);

  if (episodios.length === 0) {
    return <p className="text-apagado">No hay episodios registrados.</p>;
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {episodios.map((ep) => (
        <li key={ep.id}>
          <Link
            href={`/episodios/${ep.id}`}
            className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-3 transition hover:border-portal/60"
          >
            <span className="rounded-md bg-portal/15 px-2 py-1 font-mono text-xs font-bold text-portal">
              {ep.episode}
            </span>
            <span className="truncate text-sm text-texto">{ep.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
