// Pagina de favoritos: /favoritos
//
// La pagina es un Server Component ESTATICO (se genera una sola vez en el
// build). Solo FavoritesView es Client Component, porque los datos estan en
// el localStorage del navegador y el servidor no puede leerlos.

import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import FavoritesView from "@/components/favorites/FavoritesView";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Tus personajes, episodios y ubicaciones favoritos, guardados en tu navegador.",
};

export default function FavoritosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tu coleccion"
        title="Favoritos"
        description="Todo lo que marcaste con el corazon. Se guarda en el localStorage de este navegador, asi que sigue aqui aunque cierres la pestana."
      />
      <FavoritesView />
    </>
  );
}
