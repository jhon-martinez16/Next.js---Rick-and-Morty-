"use client";

// Limite de errores (Error Boundary) de la aplicacion.
// Si la API se cae o algo falla al renderizar, en lugar de una pantalla en
// blanco se muestra este mensaje con opcion de reintentar.
// Debe ser Client Component porque usa el boton "Reintentar" (onClick).

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  // retry (Next 16.3+) vuelve a pedir los datos al servidor y re-renderiza el segmento
  retry: () => void;
}

export default function Error({ error, retry }: ErrorProps) {
  useEffect(() => {
    // En un proyecto real aqui se enviaria el error a un servicio de monitoreo
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="h-20 w-20 rounded-full border-4 border-muerto/40 bg-muerto/10" aria-hidden />
      <h1 className="mt-6 text-2xl font-bold text-texto sm:text-3xl">Algo salio mal en el portal</h1>
      <p className="mt-3 max-w-md text-apagado">
        No pudimos comunicarnos con la API de Rick and Morty. Revisa tu conexion e intenta de nuevo.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-portal px-6 py-3 font-semibold text-fondo hover:bg-portal-oscuro"
        >
          Reintentar
        </button>
        <Link href="/" className="rounded-lg border border-borde px-6 py-3 font-semibold text-texto hover:border-portal">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
