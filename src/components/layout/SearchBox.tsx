"use client";

// Barra de busqueda global que vive en el Navbar.
// Al enviar el formulario navega a /buscar?q=texto, donde un Server Component
// busca el termino en personajes, episodios y ubicaciones al mismo tiempo.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/ui/icons";

interface SearchBoxProps {
  className?: string;
  onSearch?: () => void; // permite cerrar el menu movil despues de buscar
}

export default function SearchBox({ className, onSearch }: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Si ya estamos en /buscar, el campo arranca con el termino actual
  const [termino, setTermino] = useState(
    pathname === "/buscar" ? (searchParams.get("q") ?? "") : "",
  );

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const limpio = termino.trim();
    if (!limpio) return;
    router.push(`/buscar?q=${encodeURIComponent(limpio)}`);
    onSearch?.();
  }

  return (
    <form role="search" onSubmit={manejarEnvio} className={cn("relative", className)}>
      <label htmlFor="busqueda-global" className="sr-only">
        Buscar en todo el multiverso
      </label>
      <SearchIcon
        width={18}
        height={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-apagado"
      />
      <input
        id="busqueda-global"
        type="search"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        placeholder="Buscar personajes, episodios, lugares..."
        className="w-full rounded-lg border border-borde bg-superficie-2 py-2.5 pl-10 pr-20 text-sm text-texto placeholder:text-apagado/70 focus:border-portal focus:outline-none"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!termino.trim()}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-portal px-3 py-1.5 text-xs font-semibold text-fondo transition hover:bg-portal-oscuro disabled:cursor-not-allowed disabled:opacity-40"
      >
        Buscar
      </button>
    </form>
  );
}
