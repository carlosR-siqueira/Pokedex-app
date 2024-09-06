import Link from 'next/link'
import styles from "./page.module.css";

type Pokemon = {
  name: string;
  url: string;
};

type PokemonDetails = {
  sprite: string;
};

async function fetchPokemon(): Promise<Pokemon[]> {
  const api_url = process.env.NEXT_PUBLIC_API_URL_POKEMONS as string;
  const result = await fetch(api_url, { next: { revalidate: 3600 } });
  const jsonResult = await result.json();
  return jsonResult.results;
}

async function fetchPokemonPersona(id: string): Promise<PokemonDetails> {
  const api_url = process.env.NEXT_PUBLIC_API_URL_POKEMONS as string;
  const result = await fetch(`${api_url}/${id}`, { next: { revalidate: 3600 } });
  const jsonResult = await result.json();

  return {
    sprite: jsonResult.sprites.other.dream_world.front_default,
  };
}

export default async function Home() {
  const pokemons = await fetchPokemon();

  // Fazer todas as chamadas para os detalhes dos Pokémons de uma vez
  const pokemonsDetails = await Promise.all(
    pokemons.map(async (pokemon: Pokemon) => {
      const id = pokemon.url.split('/')[6];
      const details = await fetchPokemonPersona(id);
      return {
        ...pokemon,
        sprite: details.sprite,
        id, // Adicionando o id para usar no Link
      };
    })
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Lista de Pokémons</h1>
      <section className={styles.pokemonList}>
        {pokemonsDetails.map((pokemon) => (
          <Link href={`/pokemon/${pokemon.id}`} key={pokemon.name}>
            <div className={styles.pokemonItem}>
              <p className={styles.pokemon}>{("00" + pokemon.id).slice(-3)}</p>
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className={styles.pokemonImage}
              />
              <p className={styles.pokemon}>{pokemon.name}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
