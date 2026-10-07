  import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { fetchAllPokemon } from "../api/pokemon";
import type { Pokemon } from "../types";

const CACHE_KEY = "pokemon";
  
  
  interface PokemonContextValue {
     pokemon: Pokemon[];
     loading: boolean;
     error: string | null;
     reload: () => void;
   }
   const PokemonContext = createContext<PokemonContextValue | undefined>(
  undefined
);

function readCache(): Pokemon[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Pokemon[]) : null;
  } catch {
    return null;
  }
}

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (useCache: boolean) => {
    if (useCache) {
      const cached = readCache();
      if (cached && cached.length > 0) {
        setPokemon(cached);
        setLoading(false);
        return;
      }
    }
    try {
      const data = await fetchAllPokemon();
      setPokemon(data);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {
        
      }
    } catch {
      setError("Couldn't load Pokémon. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(true);
  }, [load]);

  const reload = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    setLoading(true);
    setError(null);
    load(false);
  }, [load]);

  return (
    <PokemonContext.Provider value={{ pokemon, loading, error, reload }}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon(): PokemonContextValue {
  const ctx = useContext(PokemonContext);
  if (!ctx) {
    throw new Error("usePokemon must be used inside a PokemonProvider");
  }
  return ctx;
}