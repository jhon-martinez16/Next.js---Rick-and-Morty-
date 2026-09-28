// Layout raiz: envuelve TODAS las paginas de la aplicacion.
//
// Es un Server Component. Aqui se define la estructura base que pide el
// taller: Navbar (con menu y searchbox), contenido principal y Footer.

import type { Metadata, Viewport } from "next";
// Las fuentes Geist se cargan desde el paquete "geist" (archivos locales),
// asi el build no depende de descargar nada de Google Fonts.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Metadatos por defecto. Cada pagina puede sobrescribir el titulo y
// el "template" agrega " | Rick & Morty Explorer" al final.
export const metadata: Metadata = {
  title: {
    default: "Rick & Morty Explorer",
    template: "%s | Rick & Morty Explorer",
  },
  description:
    "Explora personajes, episodios y ubicaciones del universo de Rick and Morty. Taller de Next.js - Aplicaciones Hibridas.",
  keywords: ["Rick and Morty", "Next.js", "App Router", "API", "Aplicaciones Hibridas"],
};

// Color de la barra del navegador en celulares
export const viewport: Viewport = {
  themeColor: "#0b0f19",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {/* Enlace oculto para saltar el menu con el teclado (accesibilidad) */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-portal focus:px-4 focus:py-2 focus:text-fondo"
        >
          Saltar al contenido
        </a>

        <Navbar />

        {/* flex-1 hace que el footer siempre quede abajo aunque haya poco contenido */}
        <main id="contenido" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
