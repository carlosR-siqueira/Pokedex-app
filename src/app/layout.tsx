import { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import Image from 'next/image';
import './globals.css'; 



const roboto = Roboto_Mono({ subsets: ['latin']});

export const metadata: Metadata = {
  title: "Pokedex App",
  description: "Pokedex criada por: Carlos Siqueira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={roboto.className}>
        <main className='content'>
          <nav className='menu'>
            <section className='menuContent'>
              <Image width={48} height={48} src='https://pngimg.com/d/pokemon_logo_PNG12.png' alt='logo'/>
              <h1>Pokemon</h1>
            </section>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
