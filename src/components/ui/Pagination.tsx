// Paginacion clasica con numeros.
//
// Es un Server Component: cada boton es un <Link> con la URL de la pagina,
// por lo que funciona incluso sin JavaScript y Next puede precargar
// (prefetch) la siguiente pagina. Conserva los filtros activos en la URL.

import Link from "next/link";
import { buildQueryString, cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // ej: "/personajes"
  params?: Record<string, string | undefined>; // filtros activos a conservar
}

// Calcula que numeros mostrar. Ej: pagina 7 de 42 -> [1, "...", 6, 7, 8, "...", 42]
function getPageItems(actual: number, total: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: Array<number | "..."> = [1];
  const inicio = Math.max(2, actual - 1);
  const fin = Math.min(total - 1, actual + 1);

  if (inicio > 2) items.push("...");
  for (let i = inicio; i <= fin; i++) items.push(i);
  if (fin < total - 1) items.push("...");

  items.push(total);
  return items;
}

export default function Pagination({ currentPage, totalPages, basePath, params = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Arma el href conservando los filtros. La pagina 1 no se escribe en la URL.
  const hrefDe = (pagina: number) =>
    `${basePath}${buildQueryString({ ...params, page: pagina > 1 ? pagina : undefined })}`;

  const estiloBase =
    "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition";
  const estiloNormal = "border-borde bg-superficie text-texto hover:border-portal hover:text-portal";
  const estiloDeshabilitado = "pointer-events-none border-borde/50 bg-superficie/40 text-apagado/50";

  const hayAnterior = currentPage > 1;
  const haySiguiente = currentPage < totalPages;

  return (
    <nav aria-label="Paginacion" className="mt-10 flex flex-col items-center gap-3">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <Link
            href={hrefDe(currentPage - 1)}
            aria-label="Pagina anterior"
            aria-disabled={!hayAnterior}
            tabIndex={hayAnterior ? undefined : -1}
            className={cn(estiloBase, hayAnterior ? estiloNormal : estiloDeshabilitado)}
          >
            <ChevronLeftIcon />
            <span className="ml-1 hidden sm:inline">Anterior</span>
          </Link>
        </li>

        {getPageItems(currentPage, totalPages).map((item, i) =>
          item === "..." ? (
            // Los puntos suspensivos no son clicables
            <li key={`sep-${i}`} className="px-1 text-apagado" aria-hidden>
              ...
            </li>
          ) : (
            // En celular solo mostramos la pagina actual y los extremos para ahorrar espacio
            <li
              key={item}
              className={cn(
                item !== currentPage && item !== 1 && item !== totalPages && "hidden sm:block",
              )}
            >
              <Link
                href={hrefDe(item)}
                aria-current={item === currentPage ? "page" : undefined}
                className={cn(
                  estiloBase,
                  item === currentPage ? "border-portal bg-portal text-fondo" : estiloNormal,
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}

        <li>
          <Link
            href={hrefDe(currentPage + 1)}
            aria-label="Pagina siguiente"
            aria-disabled={!haySiguiente}
            tabIndex={haySiguiente ? undefined : -1}
            className={cn(estiloBase, haySiguiente ? estiloNormal : estiloDeshabilitado)}
          >
            <span className="mr-1 hidden sm:inline">Siguiente</span>
            <ChevronRightIcon />
          </Link>
        </li>
      </ul>
      <p className="text-sm text-apagado">
        Pagina {currentPage} de {totalPages}
      </p>
    </nav>
  );
}
