import axios from "axios";
import type { Pokemon } from "../types.ts";

interface PokemonListResponse {
  results: { name: string; url: string }[];
}

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    other: { "official-artwork": { front_default: string | null } };
  };
}

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";

function getStat(detail: PokemonDetail, statName: string): number {
  const found = detail.stats.find((s) => s.stat.name === statName);
  return found ? found.base_stat : 0;
}

function toPokemon(detail: PokemonDetail): Pokemon {
  return {
    id: detail.id,
    name: detail.name,
    types: detail.types.map((t) => t.type.name),
    hp: getStat(detail, "hp"),
    attack: getStat(detail, "attack"),
    height: detail.height,
    weight: detail.weight,
    imageUrl: detail.sprites.other["official-artwork"].front_default ?? "",
  };
}

export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const list = await axios.get<PokemonListResponse>(API_URL);

  const details = await Promise.all(
    list.data.results.map((p) => axios.get<PokemonDetail>(p.url))
  );

  return details.map((res) => toPokemon(res.data));
}