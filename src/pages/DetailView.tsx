import { Link, useParams } from "react-router-dom";
import { usePokemon } from "../context/PokemonContext";
import styles from "./DetailView.module.css"

export default function ListView() {
  const { id } = useParams();
  const { pokemon, loading, error, reload } = usePokemon();

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

  const currentId = Number(id);
  const index = pokemon.findIndex((p) => p.id === currentId);

  if (index === -1) {
    return (
      <main className={styles.page}>
        <p>Pokémon not found.</p>
        <Link to="/list">Back to list</Link>
      </main>
    );
  }

  const current = pokemon[index];
  const prevId = pokemon[(index - 1 + pokemon.length) % pokemon.length].id;
  const nextId = pokemon[(index + 1) % pokemon.length].id;

  return (
    <main className={styles.page}>
      <Link to="/list" className={styles.back}>
        ← Back to list
      </Link>

      <div className={styles.nav}>
        <Link to={`/pokemon/${prevId}`} className={styles.navButton}>
          ← Previous
        </Link>
        <Link to={`/pokemon/${nextId}`} className={styles.navButton}>
          Next →
        </Link>
      </div>

      <article className={styles.card}>
        <h1 className={styles.name}>
          #{current.id} {current.name}
        </h1>

        <img
          src={current.imageUrl}
          alt={current.name}
          className={styles.image}
        />

        <ul className={styles.types}>
          {current.types.map((t) => (
            <li key={t} className={`${styles.badge} ${styles[t] ?? ""}`}>
              {t}
            </li>
          ))}
        </ul>

        <dl className={styles.stats}>
          <div>
            <dt>HP</dt>
            <dd>{current.hp}</dd>
          </div>
          <div>
            <dt>Attack</dt>
            <dd>{current.attack}</dd>
          </div>
          <div>
            <dt>Height</dt>
            <dd>{current.height / 10} m</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>{current.weight / 10} kg</dd>
          </div>
        </dl>
      </article>
    </main>
  );
}