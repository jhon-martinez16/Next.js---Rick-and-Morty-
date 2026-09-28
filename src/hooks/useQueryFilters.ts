"use client";

// Hook que conecta los filtros con la URL (?name=rick&status=alive&page=2).
//
// Guardar los filtros en la URL tiene varias ventajas:
// - El Server Component de la pagina los lee y hace la consulta en el servidor.
// - Se pueden compartir o guardar como marcador.
// - Los botones atras/adelante del navegador funcionan.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function useQueryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // isPending es true mientras Next trae la nueva pagina del servidor
  const [isPending, startTransition] = useTransition();

  // Lee un filtro de la URL (cadena vacia si no existe)
  const getFilter = useCallback(
    (clave: string) => searchParams.get(clave) ?? "",
    [searchParams],
  );

  // Cambia uno o varios filtros a la vez.
  // Siempre vuelve a la pagina 1 porque el total de resultados cambia.
  const setFilters = useCallback(
    (cambios: Record<string, string>) => {
      // Si ningun valor es distinto al que ya esta en la URL no hacemos nada.
      // Esto evita que el debounce del primer render nos regrese a la pagina 1.
      const hayCambios = Object.entries(cambios).some(
        ([clave, valor]) => (searchParams.get(clave) ?? "") !== valor.trim(),
      );
      if (!hayCambios) return;

      const params = new URLSearchParams(searchParams.toString());

      Object.entries(cambios).forEach(([clave, valor]) => {
        if (valor.trim()) params.set(clave, valor.trim());
        else params.delete(clave);
      });
      params.delete("page");

      const query = params.toString();
      startTransition(() => {
        // replace en vez de push para no llenar el historial con cada tecla
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  // Borra todos los filtros
  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  // Cuantos filtros hay activos (sin contar la pagina)
  const activeCount = Array.from(searchParams.keys()).filter((k) => k !== "page").length;

  return { getFilter, setFilters, clearFilters, isPending, activeCount };
}
