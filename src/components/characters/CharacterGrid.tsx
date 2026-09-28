// Grilla responsiva de personajes: 1 columna en celular, 2 en tablet,
// 3 en laptop y 4 en pantallas grandes.
import type { Character } from "@/interfaces";
import CharacterCard from "./CharacterCard";

export default function CharacterGrid({ characters }: { characters: Character[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {characters.map((character, i) => (
        // Las primeras 4 imagenes se cargan con prioridad porque se ven sin hacer scroll
        <CharacterCard key={character.id} character={character} priority={i < 4} />
      ))}
    </div>
  );
}
