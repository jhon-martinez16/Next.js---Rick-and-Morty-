"use client";

// Devuelve true solo cuando el componente ya esta corriendo en el navegador.
// Sirve para no mostrar datos de localStorage durante el render del servidor
// (el servidor no los conoce) y evitar que la interfaz "parpadee".

import { useSyncExternalStore } from "react";

// No hay nada a que suscribirse: el valor nunca cambia despues de hidratar
const noSuscribir = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    noSuscribir,
    () => true, // en el navegador
    () => false, // en el servidor
  );
}
