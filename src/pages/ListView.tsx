/*export default function DetailView() {
  //return <h1>Detail</h1>;
  const { pokemon, loading, error } = usePokemon();
if (loading) return <p>Loading...</p>;
if (error) return <p>{error}</p>;
return <h1>List ({pokemon.length})</h1>;
}*/
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePokemon } from "../context/PokemonContext";
import type { Pokemon } from "../types";
import styles from "./ListView.module.css";

type SortKey = "id" | "name" | "hp" | "attack" | "height" | "weight";
type SortDir = "asc" | "desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "hp", label: "HP" },
  { value: "attack", label: "Attack" },
  { value: "height", label: "Height" },
  { value: "weight", label: "Weight" },
];

function compare(a: Pokemon, b: Pokemon, key: SortKey): number {
  if (key === "name") {
    return a.name.localeCompare(b.name);
  }
  return a[key] - b[key];
}

export default function ListView() {
  const { pokemon, loading, error, reload } = usePokemon();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = pokemon.filter((p) => p.name.includes(q));
    const sorted = [...filtered].sort((a, b) => compare(a, b, sortKey));
    return sortDir === "desc" ? sorted.reverse() : sorted;
  }, [pokemon, query, sortKey, sortDir]);

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
      <h1>Pokédex List</h1>

      <div className={styles.controls}>
        <input
          type="text"
          className={styles.search}
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search Pokémon by name"
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
        >
          {sortDir === "asc" ? "Ascending ↑" : "Descending ↓"}
        </button>
      </div>

      <p className={styles.count}>
        Showing {results.length} of {pokemon.length}
      </p>

      {results.length === 0 ? (
        <p>No Pokémon match "{query}".</p>
      ) : (
        <ul className={styles.list}>
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/pokemon/${p.id}`} className={styles.item}>
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className={styles.sprite}
                  loading="lazy"
                />
                <span className={styles.name}>
                  #{p.id} {p.name}
                </span>
                <span className={styles.stats}>
                  HP {p.hp} · ATK {p.attack} · {p.height / 10} m ·{" "}
                  {p.weight / 10} kg
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}