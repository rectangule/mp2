import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePokemon } from "../context/PokemonContext";
import styles from "./GalleryView.module.css";


export default function GalleryView() {
  const { pokemon, loading, error, reload } = usePokemon();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const allTypes = useMemo(
    () => [...new Set(pokemon.flatMap((p) => p.types))].sort(),
    [pokemon]
  );

  const filtered = useMemo(() => {
    if (selectedTypes.length === 0) return pokemon;
    return pokemon.filter((p) =>
      selectedTypes.every((t) => p.types.includes(t))
    );
  }, [pokemon, selectedTypes]);

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button type="button" onClick={reload}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <h1>Pokédex Gallery</h1>

      <div className={styles.filters}>
        {allTypes.map((type) => {
          const active = selectedTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              aria-pressed={active}
              className={active ? `${styles.chip} ${styles.active}` : styles.chip}
              onClick={() => toggleType(type)}
            >
              {type}
            </button>
          );
        })}
        <button
          type="button"
          className={styles.clear}
          onClick={() => setSelectedTypes([])}
          disabled={selectedTypes.length === 0}
        >
          Clear filters
        </button>
      </div>

      <p className={styles.count}>
        Showing {filtered.length} of {pokemon.length}
        {selectedTypes.length > 1 && " (Pokémon with all selected types)"}
      </p>

      {filtered.length === 0 ? (
        <p>No Pokémon have all of the selected types.</p>
      ) : (
        <ul className={styles.grid}>
          {filtered.map((p) => (
            <li key={p.id}>
              <Link to={`/pokemon/${p.id}`} className={styles.item}>
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className={styles.image}
                  loading="lazy"
                />
                <span className={styles.name}>{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}