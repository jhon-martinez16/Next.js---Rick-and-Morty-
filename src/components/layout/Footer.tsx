// Pie de pagina (Server Component 100% estatico, no envia JavaScript)
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { PortalLogo } from "@/components/ui/icons";

export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-borde bg-superficie">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        {/* Columna 1: descripcion */}
        <div>
          <div className="flex items-center gap-2">
            <PortalLogo width={28} height={28} />
            <span className="font-bold text-texto">
              Rick<span className="text-portal">&amp;</span>Morty Explorer
            </span>
          </div>
          <p className="mt-3 text-sm text-apagado">
            Taller de Next.js - Desarrollo Aplicaciones Moviles Hibridas.
          </p>
        </div>

        {/* Columna 2: navegacion */}
        <nav aria-label="Pie de pagina">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-texto">Secciones</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {NAV_LINKS.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className="text-apagado transition hover:text-portal">
                  {enlace.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Columna 3: creditos */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-texto">Fuente de datos</h2>
          <p className="mt-3 text-sm text-apagado">
            Informacion obtenida de{" "}
            <a
              href="https://rickandmortyapi.com/documentation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cian hover:underline"
            >
              The Rick and Morty API
            </a>
            . Rick and Morty es propiedad de sus respectivos creadores.
          </p>
        </div>
      </div>
      <div className="border-t border-borde py-4 text-center text-xs text-apagado">
        {anio} - Hecho con Next.js, React y Tailwind CSS
      </div>
    </footer>
  );
}
