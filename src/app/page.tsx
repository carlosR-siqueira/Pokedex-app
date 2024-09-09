'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "./page.module.css";

type Pokemon = {
  name: string;
  url: string;
};

type PokemonDetails = {
  sprite: string;
};

async function fetchPokemon(limit: number = 20, offset: number = 0): Promise<Pokemon[]> {
  const api_url = process.env.NEXT_PUBLIC_API_URL_POKEMONS as string;
  const result = await fetch(`${api_url}/?limit=${limit}&offset=${offset}`, { next: { revalidate: 3600 } });
  const jsonResult = await result.json();
  return jsonResult.results;
}

async function fetchPokemonPersona(id: string): Promise<PokemonDetails> {
  const api_url = process.env.NEXT_PUBLIC_API_URL_POKEMONS as string;
  const result = await fetch(`${api_url}/${id}`, { next: { revalidate: 3600 } });
  const jsonResult = await result.json();

  return {
    sprite: jsonResult.sprites.other.showdown.front_default || jsonResult.sprites.other.dream_world.front_default || jsonResult.sprites.front_default || jsonResult.sprites.other.home.front_default || jsonResult.sprites.other['official-artwork'].front_default,
  };
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(0); // Controla o número da página
  const [loading, setLoading] = useState(false);

  const loadPokemons = async () => {
    setLoading(true);
    const newPokemons = await fetchPokemon(20, page * 20); // Carrega 20 Pokémons por vez
    const pokemonsDetails = await Promise.all(
      newPokemons.map(async (pokemon: Pokemon) => {
        const id = pokemon.url.split('/')[6];
        const details = await fetchPokemonPersona(id);
        return {
          ...pokemon,
          sprite: details.sprite,
          id,
        };
      })
    );
    setPokemons((prev) => [...prev, ...pokemonsDetails]); // Acrescenta os novos Pokémons à lista
    setLoading(false);
  };

  useEffect(() => {
    loadPokemons(); // Carrega os Pokémons da primeira página
  }, [page]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Lista de Pokémons</h1>
      <section className={styles.pokemonList}>
        {pokemons.map((pokemon) => (
          <Link href={`/pokemon/${pokemon.id}`} key={pokemon.name}>
            <div className={styles.pokemonItem}>
              <p className={styles.pokemon}>#{pokemon.id}</p>
              <img
                src={pokemon.sprite || 'https://pngimg.com/d/pokemon_logo_PNG12.png'}
                alt={pokemon.name}
                className={styles.pokemonImage}
              />
              <p className={styles.pokemon}>{pokemon.name}</p>
            </div>
          </Link>
        ))}
      </section>
      <button onClick={() => setPage(page + 1)} disabled={loading}>
        {loading ? 'Carregando...' : 'Carregar Mais'}
      </button>
    </main>
  );
}
