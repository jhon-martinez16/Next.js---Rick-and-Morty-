"use client";

// Hook generico de scroll infinito.
// Observa un elemento "centinela" al final de la lista con IntersectionObserver
// y, cuando entra en pantalla, llama a onLoadMore para traer la siguiente pagina.

import { useEffect, useRef } from "react";

interface Opciones {
  onLoadMore: () => void; // que hacer cuando el centinela se ve
  enabled: boolean; // false cuando ya no hay mas paginas o se esta cargando
  rootMargin?: string; // cuanto antes de llegar al final empezamos a cargar
}

export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>({
  onLoadMore,
  enabled,
  rootMargin = "400px",
}: Opciones) {
  const centinelaRef = useRef<T | null>(null);

  // Guardamos siempre la ultima version del callback sin volver a crear el observer
  const callbackRef = useRef(onLoadMore);
  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const nodo = centinelaRef.current;
    if (!enabled || !nodo) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        if (entradas[0]?.isIntersecting) callbackRef.current();
      },
      { rootMargin },
    );

    observer.observe(nodo);
    // Al desmontar o cambiar "enabled" dejamos de observar
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return centinelaRef;
}
