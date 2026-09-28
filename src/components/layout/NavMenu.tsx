"use client";

// Menu de navegacion (escritorio + movil).
// Es Client Component porque:
// - usePathname() marca el enlace de la pagina actual.
// - useState() abre y cierra el menu hamburguesa en celular.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import FavoritesCounter from "@/components/favorites/FavoritesCounter";
import SearchBox from "./SearchBox";

// Un enlace esta activo si coincide exacto o si es una subruta (/personajes/5)
function estaActivo(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavMenu() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  // Cerramos el menu movil cuando cambia la ruta. Se hace durante el render
  // (patron recomendado por React) en lugar de un useEffect.
  const [rutaAnterior, setRutaAnterior] = useState(pathname);
  if (rutaAnterior !== pathname) {
    setRutaAnterior(pathname);
    setAbierto(false);
  }

  const enlaces = NAV_LINKS.map((enlace) => {
    const activo = estaActivo(pathname, enlace.href);
    return { ...enlace, activo };
  });

  return (
    <>
      {/* Menu de escritorio */}
      <ul className="hidden items-center gap-1 lg:flex">
        {enlaces.map((enlace) => (
          <li key={enlace.href}>
            <Link
              href={enlace.href}
              aria-current={enlace.activo ? "page" : undefined}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition",
                enlace.activo ? "bg-portal/15 text-portal" : "text-texto hover:bg-superficie-2 hover:text-portal",
              )}
            >
              {enlace.label}
              {enlace.href === "/favoritos" && <FavoritesCounter />}
            </Link>
          </li>
        ))}
      </ul>

      {/* Boton hamburguesa: solo en celular y tablet */}
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menu" : "Abrir menu"}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-borde text-texto lg:hidden"
      >
        {abierto ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Panel desplegable del menu movil */}
      {abierto && (
        <div
          id="menu-movil"
          className="absolute inset-x-0 top-full border-b border-borde bg-superficie px-4 pb-5 pt-3 shadow-xl lg:hidden"
        >
          {/* En celular la busqueda vive dentro del menu */}
          <Suspense>
            <SearchBox className="mb-4 md:hidden" onSearch={() => setAbierto(false)} />
          </Suspense>
          <ul className="flex flex-col gap-1">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  aria-current={enlace.activo ? "page" : undefined}
                  onClick={() => setAbierto(false)}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-3 font-medium transition",
                    enlace.activo ? "bg-portal/15 text-portal" : "text-texto hover:bg-superficie-2",
                  )}
                >
                  {enlace.label}
                  {enlace.href === "/favoritos" && <FavoritesCounter />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
