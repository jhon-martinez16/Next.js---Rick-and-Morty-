// Barra superior de la aplicacion.
//
// El Navbar en si es un Server Component (logo y estructura son estaticos).
// Solo las partes interactivas son Client Components:
// - NavMenu: enlace activo y menu hamburguesa.
// - SearchBox: formulario de busqueda.
// Asi se envia el minimo de JavaScript al navegador.

import Link from "next/link";
import { Suspense } from "react";
import { PortalLogo } from "@/components/ui/icons";
import NavMenu from "./NavMenu";
import SearchBox from "./SearchBox";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-borde bg-fondo/85 backdrop-blur-md">
      <nav aria-label="Principal" className="relative mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Ir al inicio">
          <PortalLogo className="portal-giratorio" />
          <span className="text-lg font-bold leading-tight text-texto">
            Rick<span className="text-portal">&amp;</span>Morty
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-apagado">
              Explorer
            </span>
          </span>
        </Link>

        {/* Buscador: visible desde tablet. En celular se muestra dentro del menu.
            Se envuelve en Suspense porque usa useSearchParams (requisito de Next
            para que las paginas estaticas se puedan prerenderizar en el build). */}
        <div className="hidden flex-1 justify-center md:flex">
          <Suspense fallback={<div className="h-10 w-full max-w-md rounded-lg bg-superficie-2" />}>
            <SearchBox className="w-full max-w-md" />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center md:ml-0">
          <NavMenu />
        </div>
      </nav>
    </header>
  );
}
