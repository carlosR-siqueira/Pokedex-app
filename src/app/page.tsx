'use client'
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

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
  const result = await fetch(`${api_url}${id}`, { next: { revalidate: 3600 } });
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

  return <PokemonList pokemonsDetails={pokemonsDetails} />;
}

// Componente para renderizar a lista de Pokémons com paginação e busca
const PokemonList = ({ pokemonsDetails }: { pokemonsDetails: any[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10; // Defina quantos Pokémon serão mostrados por página

  // Filtrar os Pokémon com base no termo de busca
  const filteredPokemons = pokemonsDetails.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular o índice de início e fim da página atual
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPokemons = filteredPokemons.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular o número total de páginas
  const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);

  // Função para ir para a próxima página
  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // Função para voltar para a página anterior
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Lista de Pokémons</h1>

      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Resetar para a primeira página quando buscar
        }}
        className={styles.searchInput}
      />

      <section className={styles.pokemonList}>
        {currentPokemons.length > 0 ? (
          currentPokemons.map((pokemon) => (
            <Link href={`/pokemon/${pokemon.id}`} key={pokemon.name}>
              <div className={styles.pokemonItem}>
                <p className={styles.pokemon}>{('00' + pokemon.id).slice(-3)}</p>
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className={styles.pokemonImage}
                />
                <p className={styles.pokemon}>{pokemon.name}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>Nenhum Pokémon encontrado</p>
        )}
      </section>

      {/* Botões de paginação */}
      <div className={styles.pagination}>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Próxima
        </button>
      </div>
    </main>
  );
};
