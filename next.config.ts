import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image solo optimiza imagenes de dominios autorizados.
    // Las imagenes de los personajes vienen de rickandmortyapi.com
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rickandmortyapi.com",
        pathname: "/api/character/avatar/**",
      },
    ],
  },
};

export default nextConfig;
