// Encabezado reutilizable para las paginas de listado.
// Server Component: no tiene estado ni eventos, solo pinta texto.

interface PageHeaderProps {
  eyebrow: string; // texto pequeno sobre el titulo
  title: string;
  description?: string;
  children?: React.ReactNode; // espacio opcional para botones o badges
}

export default function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-portal">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-bold text-texto sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-apagado">{description}</p>}
      </div>
      {children}
    </header>
  );
}
