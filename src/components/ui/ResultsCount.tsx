// Texto con el total de resultados encontrados.
// singular y plural se reciben completos para respetar el genero en espanol:
// "personaje encontrado" / "ubicaciones encontradas".
export default function ResultsCount({ total, singular, plural }: { total: number; singular: string; plural: string }) {
  return (
    <p className="mb-5 text-sm text-apagado" aria-live="polite">
      <span className="font-semibold text-texto">{total.toLocaleString("es-CO")}</span>{" "}
      {total === 1 ? singular : plural}
    </p>
  );
}
