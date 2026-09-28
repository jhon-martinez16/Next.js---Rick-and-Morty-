// Esqueleto mientras se hacen las tres busquedas en paralelo
import { CardGridSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return (
    <>
      <div className="mb-8 h-24 w-2/3 animate-pulse rounded-xl bg-superficie" />
      <CardGridSkeleton count={4} />
    </>
  );
}
