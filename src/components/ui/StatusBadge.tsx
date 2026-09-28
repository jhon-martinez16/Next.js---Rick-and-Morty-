// Etiqueta de color para el estado de un personaje (vivo, muerto, desconocido)
import type { CharacterStatus } from "@/interfaces";
import { cn, translateStatus } from "@/lib/utils";

// Color del punto segun el estado
const colores: Record<CharacterStatus, string> = {
  Alive: "bg-vivo",
  Dead: "bg-muerto",
  unknown: "bg-desconocido",
};

export default function StatusBadge({
  status,
  className,
}: {
  status: CharacterStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-fondo/80 px-2.5 py-1 text-xs font-medium text-texto backdrop-blur",
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", colores[status] ?? "bg-desconocido")} />
      {translateStatus(status)}
    </span>
  );
}
