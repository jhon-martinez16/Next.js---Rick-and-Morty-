// Enlace de "volver" que se usa en las paginas de detalle
import Link from "next/link";
import { ArrowLeftIcon } from "./icons";

export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-apagado transition hover:text-portal"
    >
      <ArrowLeftIcon width={16} height={16} />
      {label}
    </Link>
  );
}
