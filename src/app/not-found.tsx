// Pagina 404 personalizada.
// Se muestra cuando la ruta no existe o cuando una pagina llama a notFound()
// (por ejemplo /personajes/99999).
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <p className="font-mono text-7xl font-extrabold text-portal sm:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-bold text-texto sm:text-3xl">Esta dimension no existe</h1>
      <p className="mt-3 max-w-md text-apagado">
        Parece que el portal te dejo en un lugar equivocado. Lo que buscas no esta en este multiverso.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="rounded-lg bg-portal px-6 py-3 font-semibold text-fondo hover:bg-portal-oscuro">
          Volver al inicio
        </Link>
        <Link
          href="/personajes"
          className="rounded-lg border border-borde px-6 py-3 font-semibold text-texto hover:border-portal"
        >
          Ver personajes
        </Link>
      </div>
    </div>
  );
}
