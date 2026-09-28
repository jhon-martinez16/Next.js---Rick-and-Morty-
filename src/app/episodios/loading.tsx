// Interfaz de carga instantanea al navegar hacia /episodios
import { CardGridSkeleton, FiltersSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return (
    <>
      <div className="mb-8 h-24 w-2/3 animate-pulse rounded-xl bg-superficie" />
      <FiltersSkeleton />
      <CardGridSkeleton withImage={false} />
    </>
  );
}
