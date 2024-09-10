
import Image from 'next/image';
import styles from './page.module.css'
import Link from 'next/link'

type pokemonParams = {
    params: {
        id:string;
    }
}

type PokemonDetails = {
    id: number;
    name: string;
    ability: string;
    baseExperience: number;
    height: number;
    sprite: string;
    type: string;
}

async function fetchPokemon(id: string): Promise<PokemonDetails> {
    const api_url = process.env.NEXT_PUBLIC_API_URL_POKEMONS as string;
    const result = await fetch(`${api_url}/${id}`, { next: { revalidate: 3600 } });
    const jsonResult = await result.json();
    //console.log(jsonResult);
    return ({
        id: jsonResult.id,
        name: jsonResult.name,
        ability: jsonResult.abilities[0].ability.name,
        baseExperience: jsonResult.base_experience,
        height: jsonResult.height,
        sprite: null || jsonResult.sprites.other.dream_world.front_default || jsonResult.sprites.front_default ||jsonResult.sprites.other.home.front_default || jsonResult.sprites.other['official-artwork'].front_default || null,
        type: jsonResult.types[0].type.name
    })
}
export default async function Pokemons({params: { id }}: pokemonParams) {
    const pokemon = await fetchPokemon(id);
    console.log(pokemon);
    

    return (
        <main className={styles.main}>
            <h2 className={styles.pokemonName}>{pokemon.name}</h2>
            <section className={styles.container}>{pokemon && (
                <>
                    <div className={styles.pokemonDetail}>
                    
                        <section className={styles.detailSection}>
                            <p className={styles.pokemonData}>Ability: {pokemon.ability}</p>
                            <p className={styles.pokemonData}>Base EXP: {pokemon.baseExperience}</p>
                            <p className={styles.pokemonData}>Height: {pokemon.height}</p>
                            <p className={styles.pokemonData}>type: {pokemon.type}</p>
                        </section>
                        <Image
                            src={pokemon.sprite || 'https://pngimg.com/d/pokemon_logo_PNG12.png'}
                            alt='imagem_pokemon'
                            width={250}
                            height={250}
                            className={styles.pokemonImage}
                        />
                    </div>
                </>
            )}</section>
            <Link href="/" className={styles.btn}>Início</Link>
        </main>
    )
}