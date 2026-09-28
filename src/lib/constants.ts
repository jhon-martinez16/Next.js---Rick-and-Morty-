// Constantes globales de la aplicacion.
// Tenerlas en un solo archivo evita "numeros magicos" regados por el codigo.

// URL base de la API. Se puede cambiar con la variable de entorno NEXT_PUBLIC_API_URL
// (lleva el prefijo NEXT_PUBLIC_ porque tambien se usa en componentes de cliente).
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://rickandmortyapi.com/api";

// Tiempo (en segundos) que Next guarda en cache las respuestas de la API.
// Los datos de la serie casi nunca cambian, por eso un dia es suficiente.
export const REVALIDATE_SECONDS = 60 * 60 * 24;

// La API siempre devuelve 20 elementos por pagina
export const PAGE_SIZE = 20;

// Clave con la que se guardan los favoritos en localStorage
export const FAVORITES_STORAGE_KEY = "rm-favoritos";

// Enlaces del menu principal. Se usan en el Navbar y en el Footer.
export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Personajes", href: "/personajes" },
  { label: "Episodios", href: "/episodios" },
  { label: "Ubicaciones", href: "/ubicaciones" },
  { label: "Favoritos", href: "/favoritos" },
] as const;

// Opciones de los filtros. value = lo que espera la API, label = lo que ve el usuario.
export const STATUS_OPTIONS = [
  { value: "alive", label: "Vivo" },
  { value: "dead", label: "Muerto" },
  { value: "unknown", label: "Desconocido" },
];

export const GENDER_OPTIONS = [
  { value: "female", label: "Femenino" },
  { value: "male", label: "Masculino" },
  { value: "genderless", label: "Sin genero" },
  { value: "unknown", label: "Desconocido" },
];

// Especies mas comunes dentro de la API
export const SPECIES_OPTIONS = [
  { value: "Human", label: "Humano" },
  { value: "Alien", label: "Alien" },
  { value: "Humanoid", label: "Humanoide" },
  { value: "Robot", label: "Robot" },
  { value: "Animal", label: "Animal" },
  { value: "Cronenberg", label: "Cronenberg" },
  { value: "Mythological Creature", label: "Criatura mitologica" },
  { value: "Poopybutthole", label: "Poopybutthole" },
  { value: "Disease", label: "Enfermedad" },
  { value: "unknown", label: "Desconocida" },
];

// Temporadas disponibles. La API permite filtrar por "S01", "S02", etc.
export const SEASON_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  value: `S0${n}`,
  label: `Temporada ${n}`,
}));

// Tipos de ubicacion mas frecuentes
export const LOCATION_TYPE_OPTIONS = [
  { value: "Planet", label: "Planeta" },
  { value: "Space station", label: "Estacion espacial" },
  { value: "Microverse", label: "Microverso" },
  { value: "Dimension", label: "Dimension" },
  { value: "Cluster", label: "Cumulo" },
  { value: "Fantasy town", label: "Pueblo de fantasia" },
  { value: "Dream", label: "Sueno" },
  { value: "Resort", label: "Resort" },
  { value: "TV", label: "Television" },
];
