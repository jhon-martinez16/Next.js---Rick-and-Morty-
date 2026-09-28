// "Store" muy pequeno para los favoritos guardados en localStorage.
//
// Por que no un simple useState + useEffect?
// Porque varios componentes (el contador del Navbar, los botones de cada
// tarjeta y la pagina de favoritos) necesitan ver el mismo dato y
// actualizarse al mismo tiempo. React trae useSyncExternalStore justamente
// para suscribirse a una fuente externa (localStorage) sin desincronizarse
// y sin errores de hidratacion.

import type { Favorite, FavoriteType } from "@/interfaces";
import { FAVORITES_STORAGE_KEY } from "./constants";

// Evento propio para avisar a la pestana actual que los favoritos cambiaron.
// (El evento "storage" del navegador solo se dispara en las OTRAS pestanas.)
const EVENTO_CAMBIO = "rm-favoritos-cambio";

// Arreglo vacio constante: el servidor no tiene localStorage, asi que
// siempre usa este valor. Debe ser la misma referencia en cada llamada.
const SIN_FAVORITOS: Favorite[] = [];

// Cache del ultimo valor leido. useSyncExternalStore exige que getSnapshot
// devuelva la MISMA referencia si los datos no cambiaron, de lo contrario
// entra en un ciclo infinito de renders.
let ultimoTexto: string | null = null;
let ultimoValor: Favorite[] = SIN_FAVORITOS;

// Lee y parsea los favoritos de forma segura
function leerFavoritos(): Favorite[] {
  let texto: string | null = null;
  try {
    texto = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
  } catch {
    // Algunos navegadores bloquean localStorage (modo privado estricto)
    return SIN_FAVORITOS;
  }

  if (texto === ultimoTexto) return ultimoValor;

  ultimoTexto = texto;
  try {
    const datos = texto ? JSON.parse(texto) : [];
    ultimoValor = Array.isArray(datos) ? (datos as Favorite[]) : SIN_FAVORITOS;
  } catch {
    // Si alguien edito el JSON a mano y quedo mal formado, empezamos de cero
    ultimoValor = SIN_FAVORITOS;
  }
  return ultimoValor;
}

// Guarda la lista completa y avisa a los suscriptores
function guardarFavoritos(favoritos: Favorite[]) {
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritos));
  } catch {
    // Si el almacenamiento esta lleno o bloqueado no rompemos la app
  }
  window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

// ---- API publica del store ----

// Se suscribe a cambios (misma pestana y otras pestanas).
// Devuelve la funcion para cancelar la suscripcion.
export function subscribe(callback: () => void) {
  const alCambiarStorage = (evento: StorageEvent) => {
    if (evento.key === FAVORITES_STORAGE_KEY) callback();
  };
  window.addEventListener(EVENTO_CAMBIO, callback);
  window.addEventListener("storage", alCambiarStorage);
  return () => {
    window.removeEventListener(EVENTO_CAMBIO, callback);
    window.removeEventListener("storage", alCambiarStorage);
  };
}

// Valor actual en el navegador
export function getSnapshot(): Favorite[] {
  return leerFavoritos();
}

// Valor durante el render en el servidor (no hay localStorage)
export function getServerSnapshot(): Favorite[] {
  return SIN_FAVORITOS;
}

// Compara por tipo + id, porque un personaje y un episodio pueden tener el mismo id
function esIgual(a: Pick<Favorite, "id" | "type">, id: number, type: FavoriteType) {
  return a.id === id && a.type === type;
}

export function addFavorite(item: Omit<Favorite, "addedAt">) {
  const actuales = leerFavoritos();
  if (actuales.some((f) => esIgual(f, item.id, item.type))) return;
  guardarFavoritos([{ ...item, addedAt: Date.now() }, ...actuales]);
}

export function removeFavorite(id: number, type: FavoriteType) {
  guardarFavoritos(leerFavoritos().filter((f) => !esIgual(f, id, type)));
}

export function clearFavorites(type?: FavoriteType) {
  // Sin tipo se borran todos, con tipo solo los de esa categoria
  guardarFavoritos(type ? leerFavoritos().filter((f) => f.type !== type) : []);
}
