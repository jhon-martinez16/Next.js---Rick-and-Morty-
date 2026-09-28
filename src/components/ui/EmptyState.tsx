// Mensaje que se muestra cuando una lista no tiene resultados
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ title, message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-borde bg-superficie/50 px-6 py-16 text-center">
      {/* Circulo decorativo tipo "portal apagado" */}
      <div className="mb-5 h-16 w-16 rounded-full border-4 border-portal/30 bg-portal/10" aria-hidden />
      <h2 className="text-xl font-semibold text-texto">{title}</h2>
      {message && <p className="mt-2 max-w-md text-apagado">{message}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 rounded-lg bg-portal px-5 py-2.5 font-semibold text-fondo transition hover:bg-portal-oscuro"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
