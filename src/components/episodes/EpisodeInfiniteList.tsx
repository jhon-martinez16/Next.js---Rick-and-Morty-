"use client";

// Lista de episodios con SCROLL INFINITO.
//
// Estrategia hibrida:
// 1. La primera pagina llega renderizada desde el servidor (initialData),
//    asi el contenido aparece rapido y es visible para buscadores (SEO).
// 2. Cuando el usuario llega al final, el navegador pide la siguiente
//    pagina directamente a la API y la agrega a la lista.
//
// Para contrastar, personajes y ubicaciones usan paginacion clasica.

import { useCallback, useState } from "react";
import type { ApiResponse, Episode, EpisodeFilters } from "@/interfaces";
import { getEpisodes } from "@/services/episodes.service";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import EpisodeCard from "./EpisodeCard";

interface EpisodeInfiniteListProps {
  initialData: ApiResponse<Episode>;
  filters: Omit<EpisodeFilters, "page">;
}

export default function EpisodeInfiniteList({ initialData, filters }: EpisodeInfiniteListProps) {
  const [episodios, setEpisodios] = useState<Episode[]>(initialData.results);
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPaginas = initialData.info.pages;
  const hayMas = pagina < totalPaginas;

  // Trae la siguiente pagina y la concatena
  const cargarMas = useCallback(async () => {
    if (cargando || !hayMas) return;
    setCargando(true);
    setError(null);
    try {
      const siguiente = pagina + 1;
      const data = await getEpisodes({ ...filters, page: siguiente });
      if (data) {
        // Filtramos por id para no duplicar si la peticion se dispara dos veces
        setEpisodios((prev) => {
          const ids = new Set(prev.map((e) => e.id));
          return [...prev, ...data.results.filter((e) => !ids.has(e.id))];
        });
        setPagina(siguiente);
      }
    } catch {
      setError("No se pudieron cargar mas episodios. Revisa tu conexion.");
    } finally {
      setCargando(false);
    }
  }, [cargando, hayMas, pagina, filters]);

  // El observer solo se activa si hay mas paginas, no estamos cargando y no hubo error
  const centinelaRef = useInfiniteScroll({
    onLoadMore: cargarMas,
    enabled: hayMas && !cargando && !error,
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {episodios.map((episodio) => (
          <EpisodeCard key={episodio.id} episode={episodio} />
        ))}
      </div>

      {/* Elemento invisible que dispara la carga al entrar en pantalla */}
      <div ref={centinelaRef} aria-hidden className="h-px" />

      <div className="mt-8 flex flex-col items-center gap-3 text-sm text-apagado" aria-live="polite">
        {cargando && (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-portal border-t-transparent" />
            Cargando mas episodios...
          </span>
        )}

        {error && (
          <>
            <span className="text-muerto">{error}</span>
            <button
              type="button"
              onClick={cargarMas}
              className="rounded-lg border border-borde px-4 py-2 text-texto hover:border-portal"
            >
              Reintentar
            </button>
          </>
        )}

        {/* Boton de respaldo por si el navegador no soporta IntersectionObserver */}
        {hayMas && !cargando && !error && (
          <button
            type="button"
            onClick={cargarMas}
            className="rounded-lg border border-borde px-4 py-2 text-texto transition hover:border-portal hover:text-portal"
          >
            Cargar mas
          </button>
        )}

        {!hayMas && (
          <span>
            Mostrando los {episodios.length} episodios. Llegaste al final del multiverso.
          </span>
        )}
      </div>
    </>
  );
}
