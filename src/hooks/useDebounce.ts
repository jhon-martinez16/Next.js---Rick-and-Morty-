"use client";

// Retrasa la actualizacion de un valor hasta que el usuario deja de escribir.
// Se usa en los filtros de texto para no navegar (ni llamar a la API)
// con cada tecla presionada.

import { useEffect, useState } from "react";

export function useDebounce<T>(valor: T, retrasoMs = 400): T {
  const [valorRetrasado, setValorRetrasado] = useState(valor);

  useEffect(() => {
    // Programamos la actualizacion...
    const temporizador = setTimeout(() => setValorRetrasado(valor), retrasoMs);
    // ...y si el valor cambia antes de tiempo, cancelamos la anterior
    return () => clearTimeout(temporizador);
  }, [valor, retrasoMs]);

  return valorRetrasado;
}
