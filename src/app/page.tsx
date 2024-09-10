'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

type Pokemon = {
  name: string;
  url: string;
};

type PokemonDetails = {
  sprite: string;
};

type PokemonWithDetails = Pokemon & {
  id: string;
  sprite: string;
};

async function fetchPokemon(limit: number, offset: number): Promise<Pokemon[]> {
  const api_url = process.env.NEXT_PUBLIC_API_URL_POKEMONS as string;
  const result = await fetch(`${api_url}/?limit=${limit}&offset=${offset}`);
  const jsonResult = await result.json();
  return jsonResult.results;
}

async function fetchPokemonPersona(id: string): Promise<PokemonDetails> {
  const api_url = process.env.NEXT_PUBLIC_API_URL_POKEMONS as string;
  const result = await fetch(`${api_url}/${id}`);
  const jsonResult = await result.json();
  return {
    sprite: jsonResult.sprites.other.showdown.front_default || jsonResult.sprites.other.dream_world.front_default || jsonResult.sprites.front_default || jsonResult.sprites.other.home.front_default || jsonResult.sprites.other['official-artwork'].front_default,
  };
}

export default function Home() {
  const [pokemons, setPokemons] = useState<PokemonWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 20; 

  useEffect(() => {
    async function loadPokemons() {
      setLoading(true);
      const offset = (page - 1) * limit;
      console.log(page)
      const fetchedPokemons = await fetchPokemon(limit, offset);
      const pokemonsDetails = await Promise.all(
        fetchedPokemons.map(async (pokemon: Pokemon) => {
          const id = pokemon.url.split('/')[6];
          const details = await fetchPokemonPersona(id);
          return {
            ...pokemon,
            id, 
            sprite: details.sprite, 
          };
        })
        );
        

      setPokemons(pokemonsDetails);
      setLoading(false);
    }

    loadPokemons();
  }, [page]);

  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 1));

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Lista de Pokémons</h1>
      <section className={styles.pokemonList}>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          pokemons.map((pokemon) => (
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
          ))
        )}
      </section>
      <div className={styles.pagination}>
        <button className={styles.btn} onClick={handlePreviousPage}  disabled={page === 1}>Anterior</button>
        <p className={styles.pageIndicator}>Página {page}</p>
        <button className={styles.btn} onClick={handleNextPage}>Próxima</button>
      </div>
    </main>
  );
}
