// Tarjeta de una ubicacion (Server Component con boton de favorito como isla)
import Link from "next/link";
import type { Location } from "@/interfaces";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { GlobeIcon } from "@/components/ui/icons";

export default function LocationCard({ location }: { location: Location }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-borde bg-superficie p-5 transition hover:-translate-y-1 hover:border-cian/60">
      <Link href={`/ubicaciones/${location.id}`} className="flex flex-1 flex-col pr-12">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cian/15 text-cian">
          <GlobeIcon />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-texto group-hover:text-cian">{location.name}</h2>
        <p className="mt-1 text-sm text-apagado">{location.type || "Tipo desconocido"}</p>

        <dl className="mt-auto space-y-1 pt-4 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-apagado">Dimension</dt>
            <dd className="truncate text-right text-texto">{location.dimension || "Desconocida"}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-apagado">Residentes</dt>
            <dd className="text-portal">{location.residents.length}</dd>
          </div>
        </dl>
      </Link>

      <FavoriteButton
        className="absolute right-4 top-4"
        item={{
          id: location.id,
          type: "location",
          name: location.name,
          subtitle: `${location.type || "Desconocido"} - ${location.dimension || "Dimension desconocida"}`,
        }}
      />
    </article>
  );
}
