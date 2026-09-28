// Resultados de la busqueda global: /buscar?q=rick
//
// Server Component dinamico. Busca el termino en las TRES secciones de la
// API al mismo tiempo (Promise.all) y muestra un resumen de cada una con
// un enlace para ver todos los resultados con el filtro ya aplicado.

import type { Metadata } from "next";
import Link from "next/link";
import type { SearchParams } from "@/interfaces";
import { getCharacters, getEpisodes, getLocations } from "@/services";
import { readParam } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import CharacterGrid from "@/components/characters/CharacterGrid";
import EpisodeCard from "@/components/episodes/EpisodeCard";
import LocationCard from "@/components/locations/LocationCard";

// Cantidad de resultados que se muestran por seccion en el resumen
const LIMITE_PERSONAJES = 8;
const LIMITE_OTROS = 6;

// El titulo de la pestana incluye lo que se busco
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const q = readParam((await searchParams).q)?.trim();
  return { title: q ? `Busqueda: ${q}` : "Buscar" };
}

export default async function BuscarPage({ searchParams }: { searchParams: SearchParams }) {
  const q = readParam((await searchParams).q)?.trim() ?? "";

  if (!q) {
    return (
      <>
        <PageHeader eyebrow="Busqueda" title="Buscar en el multiverso" />
        <EmptyState
          title="Escribe algo para buscar"
          message="Usa la barra de busqueda de arriba para encontrar personajes, episodios y ubicaciones por su nombre."
        />
      </>
    );
  }

  // Las tres consultas se hacen en paralelo, no una despues de otra
  const [personajes, episodios, ubicaciones] = await Promise.all([
    getCharacters({ name: q }),
    getEpisodes({ name: q }),
    getLocations({ name: q }),
  ]);

  const total =
    (personajes?.info.count ?? 0) + (episodios?.info.count ?? 0) + (ubicaciones?.info.count ?? 0);
  const qUrl = encodeURIComponent(q);

  return (
    <>
      <PageHeader
        eyebrow="Busqueda"
        title={`Resultados para "${q}"`}
        description={`${total} ${total === 1 ? "coincidencia" : "coincidencias"} entre personajes, episodios y ubicaciones.`}
      />

      {total === 0 ? (
        <EmptyState
          title="Sin resultados"
          message={`No encontramos nada llamado "${q}" en ninguna dimension. Revisa la ortografia o prueba con otra palabra.`}
          actionLabel="Ir al inicio"
          actionHref="/"
        />
      ) : (
        <div className="space-y-12">
          {personajes && (
            <SeccionResultados
              titulo="Personajes"
              total={personajes.info.count}
              href={`/personajes?name=${qUrl}`}
            >
              <CharacterGrid characters={personajes.results.slice(0, LIMITE_PERSONAJES)} />
            </SeccionResultados>
          )}

          {episodios && (
            <SeccionResultados titulo="Episodios" total={episodios.info.count} href={`/episodios?name=${qUrl}`}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {episodios.results.slice(0, LIMITE_OTROS).map((ep) => (
                  <EpisodeCard key={ep.id} episode={ep} />
                ))}
              </div>
            </SeccionResultados>
          )}

          {ubicaciones && (
            <SeccionResultados
              titulo="Ubicaciones"
              total={ubicaciones.info.count}
              href={`/ubicaciones?name=${qUrl}`}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {ubicaciones.results.slice(0, LIMITE_OTROS).map((loc) => (
                  <LocationCard key={loc.id} location={loc} />
                ))}
              </div>
            </SeccionResultados>
          )}
        </div>
      )}
    </>
  );
}

// Bloque con titulo, total y enlace "ver todos"
function SeccionResultados({
  titulo,
  total,
  href,
  children,
}: {
  titulo: string;
  total: number;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-texto">
          {titulo} <span className="text-base font-normal text-apagado">({total})</span>
        </h2>
        <Link href={href} className="shrink-0 text-sm font-medium text-portal hover:underline">
          Ver todos
        </Link>
      </div>
      {children}
    </section>
  );
}
