// Caja de "etiqueta: valor" usada en las paginas de detalle.
// Si recibe href el valor se vuelve un enlace (ej: origen del personaje).
import Link from "next/link";

interface InfoItemProps {
  label: string;
  value: string;
  href?: string | null;
}

export default function InfoItem({ label, value, href }: InfoItemProps) {
  return (
    <div className="rounded-xl border border-borde bg-superficie-2/60 p-4">
      <dt className="text-xs font-medium uppercase tracking-wider text-apagado">{label}</dt>
      <dd className="mt-1 font-semibold text-texto">
        {href ? (
          <Link href={href} className="text-cian underline-offset-4 hover:underline">
            {value}
          </Link>
        ) : (
          value || "Sin dato"
        )}
      </dd>
    </div>
  );
}
