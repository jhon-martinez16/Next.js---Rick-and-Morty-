"use client";

// Barra de filtros GENERICA y reutilizable.
//
// En lugar de escribir un formulario distinto para personajes, episodios y
// ubicaciones, cada seccion solo describe sus campos (texto o select) y este
// componente se encarga de:
// - Leer los valores actuales desde la URL.
// - Actualizar la URL (con debounce en los campos de texto).
// - Mostrar un indicador mientras el servidor trae los nuevos resultados.
// - Plegarse en celular para no ocupar toda la pantalla.

import { useEffect, useId, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryFilters } from "@/hooks/useQueryFilters";
import { cn } from "@/lib/utils";
import { CloseIcon, FilterIcon } from "@/components/ui/icons";

// Descripcion de un campo de filtro
export type FilterField =
  | { type: "text"; name: string; label: string; placeholder?: string }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[] };

interface FilterBarProps {
  fields: FilterField[];
}

const estiloCampo =
  "w-full rounded-lg border border-borde bg-superficie-2 px-3 py-2.5 text-sm text-texto placeholder:text-apagado/70 focus:border-portal focus:outline-none";

export default function FilterBar({ fields }: FilterBarProps) {
  const { getFilter, setFilters, clearFilters, isPending, activeCount } = useQueryFilters();
  const idBase = useId();

  // En celular el panel empieza cerrado
  const [abierto, setAbierto] = useState(false);

  // Los campos de texto guardan su valor localmente mientras el usuario escribe
  const camposTexto = fields.filter((f) => f.type === "text");
  const [textos, setTextos] = useState<Record<string, string>>(() =>
    Object.fromEntries(camposTexto.map((f) => [f.name, getFilter(f.name)])),
  );

  // Cuando el usuario deja de escribir 400ms, pasamos el texto a la URL
  const textosDebounced = useDebounce(textos, 400);
  useEffect(() => {
    setFilters(textosDebounced);
    // Solo debe correr cuando cambia el texto "estable", no cuando cambia setFilters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textosDebounced]);

  // Limpia la URL y tambien los campos de texto locales
  function limpiar() {
    setTextos(Object.fromEntries(camposTexto.map((f) => [f.name, ""])));
    clearFilters();
  }

  return (
    <section
      aria-label="Filtros"
      className="mb-8 rounded-2xl border border-borde bg-superficie p-4 sm:p-5"
    >
      {/* Cabecera: en celular funciona como boton para abrir/cerrar el panel */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          className="flex items-center gap-2 font-semibold text-texto md:pointer-events-none"
        >
          <FilterIcon width={18} height={18} className="text-portal" />
          Filtros
          {activeCount > 0 && (
            <span className="rounded-full bg-portal px-2 py-0.5 text-xs font-bold text-fondo">
              {activeCount}
            </span>
          )}
          <span className="text-xs font-normal text-apagado md:hidden">
            {abierto ? "(ocultar)" : "(mostrar)"}
          </span>
        </button>

        <div className="flex items-center gap-3">
          {/* Indicador de carga mientras llega la respuesta del servidor */}
          {isPending && (
            <span className="flex items-center gap-2 text-xs text-apagado" role="status">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-portal border-t-transparent" />
              Buscando...
            </span>
          )}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={limpiar}
              className="flex items-center gap-1 text-sm text-apagado transition hover:text-muerto"
            >
              <CloseIcon width={16} height={16} />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Campos. En pantallas medianas en adelante siempre se ven */}
      <div
        className={cn(
          // auto-fit reparte los campos en columnas segun el espacio disponible
          "mt-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(170px,1fr))]",
          abierto ? "grid" : "hidden md:grid",
        )}
      >
        {fields.map((campo) => {
          const id = `${idBase}-${campo.name}`;
          return (
            <div key={campo.name}>
              <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-apagado">
                {campo.label}
              </label>

              {campo.type === "text" ? (
                <input
                  id={id}
                  type="search"
                  value={textos[campo.name] ?? ""}
                  placeholder={campo.placeholder}
                  onChange={(e) => setTextos((prev) => ({ ...prev, [campo.name]: e.target.value }))}
                  className={estiloCampo}
                  autoComplete="off"
                />
              ) : (
                <select
                  id={id}
                  value={getFilter(campo.name)}
                  onChange={(e) => setFilters({ [campo.name]: e.target.value })}
                  className={estiloCampo}
                >
                  <option value="">Todos</option>
                  {campo.options.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
