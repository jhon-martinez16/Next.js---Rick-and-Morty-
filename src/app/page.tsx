// Pagina de inicio.
//
// Server Component ESTATICO con revalidacion (ISR): se genera en el build
// y Next la vuelve a generar como maximo una vez al dia. Consulta a la API
// cuantos personajes, episodios y ubicaciones existen para mostrar las
// estadisticas, y una muestra de personajes destacados.

import Link from "next/link";
import type { Character } from "@/interfaces";
import { getCharacters, getCharactersByIds, getEpisodes, getLocations } from "@/services";
import { REVALIDATE_SECONDS } from "@/lib/constants";
import CharacterGrid from "@/components/characters/CharacterGrid";
import { GlobeIcon, TvIcon, UserIcon } from "@/components/ui/icons";

// Regenerar la pagina cada 24 horas (86400 segundos).
// Next exige que este valor sea un numero literal, por eso no se usa la constante.
export const revalidate = 86400;

// Personajes que se muestran en la portada (Rick, Morty, Summer y Beth)
const DESTACADOS = [1, 2, 3, 4];

// Trae los totales. Si la API falla devolvemos null y la portada se muestra igual.
async function obtenerResumen() {
  try {
    const [personajes, episodios, ubicaciones, destacados] = await Promise.all([
      getCharacters(),
      getEpisodes(),
      getLocations(),
      getCharactersByIds(DESTACADOS),
    ]);
    return {
      personajes: personajes?.info.count ?? 0,
      episodios: episodios?.info.count ?? 0,
      ubicaciones: ubicaciones?.info.count ?? 0,
      destacados,
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const resumen = await obtenerResumen();
  const destacados: Character[] = resumen?.destacados ?? [];

  // Tarjetas de las secciones con su total
  const secciones = [
    {
      href: "/personajes",
      titulo: "Personajes",
      texto: "Filtra por estado, especie, genero y tipo. Paginacion clasica.",
      total: resumen?.personajes,
      icono: <UserIcon />,
    },
    {
      href: "/episodios",
      titulo: "Episodios",
      texto: "Busca por nombre o temporada. Scroll infinito.",
      total: resumen?.episodios,
      icono: <TvIcon />,
    },
    {
      href: "/ubicaciones",
      titulo: "Ubicaciones",
      texto: "Planetas, estaciones y dimensiones con sus residentes.",
      total: resumen?.ubicaciones,
      icono: <GlobeIcon />,
    },
  ];

  return (
    <div className="space-y-16">
      {/* Portada */}
      <section className="fondo-estrellas relative overflow-hidden rounded-3xl border border-borde bg-superficie px-6 py-14 text-center sm:px-12 sm:py-20">
        {/* Circulo verde difuminado que simula el brillo de un portal */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-portal/20 blur-3xl"
        />
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-portal">Wubba lubba dub dub</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-texto sm:text-5xl lg:text-6xl">
            Explora el multiverso de <span className="text-portal">Rick and Morty</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-apagado sm:text-lg">
            Consulta personajes, episodios y ubicaciones de la serie, aplica filtros, revisa cada
            detalle y guarda tus favoritos en el navegador.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/personajes"
              className="rounded-lg bg-portal px-6 py-3 font-semibold text-fondo transition hover:bg-portal-oscuro"
            >
              Ver personajes
            </Link>
            <Link
              href="/episodios"
              className="rounded-lg border border-borde bg-superficie-2 px-6 py-3 font-semibold text-texto transition hover:border-portal hover:text-portal"
            >
              Ver episodios
            </Link>
          </div>
        </div>
      </section>

      {/* Accesos a cada seccion con su total */}
      <section aria-labelledby="titulo-secciones">
        <h2 id="titulo-secciones" className="mb-6 text-2xl font-bold text-texto">
          Secciones
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {secciones.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-2xl border border-borde bg-superficie p-6 transition hover:-translate-y-1 hover:border-portal/60"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-portal/15 text-portal">
                {s.icono}
              </span>
              <p className="mt-5 text-4xl font-extrabold text-texto">
                {s.total ? s.total.toLocaleString("es-CO") : "--"}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-texto group-hover:text-portal">{s.titulo}</h3>
              <p className="mt-2 text-sm text-apagado">{s.texto}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Personajes destacados (solo si la API respondio) */}
      {destacados.length > 0 && (
        <section aria-labelledby="titulo-destacados">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="titulo-destacados" className="text-2xl font-bold text-texto">
              Personajes principales
            </h2>
            <Link href="/personajes" className="text-sm font-medium text-portal hover:underline">
              Ver todos
            </Link>
          </div>
          <CharacterGrid characters={destacados} />
        </section>
      )}

      {/* Nota tecnica: util para la sustentacion del taller */}
      <p className="text-center text-xs text-apagado">
        Datos cacheados en el servidor y revalidados cada {REVALIDATE_SECONDS / 3600} horas.
      </p>
    </div>
  );
}
