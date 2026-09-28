// Detalle de una ubicacion: /ubicaciones/[id]  (RUTA DINAMICA)
// Prerenderiza en el build la primera pagina de ubicaciones (SSG) y el
// resto bajo demanda con revalidacion (ISR).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { IdParams } from "@/interfaces";
import { getCharactersByIds, getLocationById, getLocations } from "@/services";
import { getIdsFromUrls, parseId } from "@/lib/utils";
import BackLink from "@/components/ui/BackLink";
import InfoItem from "@/components/ui/InfoItem";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import CharacterGrid from "@/components/characters/CharacterGrid";
import { CardGridSkeleton } from "@/components/ui/Skeletons";
import { GlobeIcon } from "@/components/ui/icons";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const data = await getLocations({ page: 1 });
    return (data?.results ?? []).map((l) => ({ id: String(l.id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: IdParams }): Promise<Metadata> {
  const id = parseId((await params).id);
  const ubicacion = id ? await getLocationById(id) : null;
  if (!ubicacion) return { title: "Ubicacion no encontrada" };
  return {
    title: ubicacion.name,
    description: `${ubicacion.name}: ${ubicacion.type} en la dimension ${ubicacion.dimension}.`,
  };
}

export default async function UbicacionDetallePage({ params }: { params: IdParams }) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const ubicacion = await getLocationById(id);
  if (!ubicacion) notFound();

  const residentesIds = getIdsFromUrls(ubicacion.residents);

  return (
    <article>
      <BackLink href="/ubicaciones" label="Volver a ubicaciones" />

      <header className="fondo-estrellas rounded-3xl border border-borde bg-superficie p-6 sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cian/15 text-cian">
          <GlobeIcon width={28} height={28} />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-texto sm:text-5xl">{ubicacion.name}</h1>

        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          <InfoItem label="Tipo" value={ubicacion.type || "Desconocido"} />
          <InfoItem label="Dimension" value={ubicacion.dimension || "Desconocida"} />
          <InfoItem label="Residentes" value={String(residentesIds.length)} />
        </dl>

        <FavoriteButton
          variant="full"
          className="mt-6 w-full sm:w-auto"
          item={{
            id: ubicacion.id,
            type: "location",
            name: ubicacion.name,
            subtitle: `${ubicacion.type || "Desconocido"} - ${ubicacion.dimension || "Dimension desconocida"}`,
          }}
        />
      </header>

      <section className="mt-10" aria-labelledby="titulo-residentes">
        <h2 id="titulo-residentes" className="mb-4 text-2xl font-bold text-texto">
          Residentes
        </h2>
        <Suspense fallback={<CardGridSkeleton count={4} />}>
          <Residentes ids={residentesIds} />
        </Suspense>
      </section>
    </article>
  );
}

// Residentes de la ubicacion (se cargan en streaming)
async function Residentes({ ids }: { ids: number[] }) {
  const personajes = await getCharactersByIds(ids);
  if (personajes.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-borde p-8 text-center text-apagado">
        Nadie vive aqui... o al menos nadie que conozcamos.
      </p>
    );
  }
  return <CharacterGrid characters={personajes} />;
}
