// Esqueletos de carga. Se muestran mientras el servidor trae los datos
// (desde loading.tsx o como fallback de un <Suspense>).

// Grilla de tarjetas grises que "pulsan"
export function CardGridSkeleton({ count = 8, withImage = true }: { count?: number; withImage?: boolean }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Cargando resultados"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-borde bg-superficie">
          {withImage && <div className="aspect-square bg-superficie-2" />}
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 rounded bg-superficie-2" />
            <div className="h-4 w-1/2 rounded bg-superficie-2" />
            <div className="h-4 w-2/3 rounded bg-superficie-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Esqueleto para las paginas de detalle
export function DetailSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Cargando detalle">
      <div className="mb-6 h-5 w-32 rounded bg-superficie-2" />
      <div className="grid gap-8 rounded-2xl border border-borde bg-superficie p-6 md:grid-cols-[300px_1fr]">
        <div className="aspect-square rounded-xl bg-superficie-2" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded bg-superficie-2" />
          <div className="h-5 w-1/3 rounded bg-superficie-2" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-superficie-2" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Esqueleto de la barra de filtros
export function FiltersSkeleton() {
  return <div className="mb-8 h-24 animate-pulse rounded-2xl border border-borde bg-superficie" />;
}
