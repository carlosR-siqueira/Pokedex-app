import Link from 'next/link'
import styles from "./page.module.css";
export default function about() {
  return (
    <main className={styles.main}>
      <h1>tela do about</h1>
      <Link href='/'>Voltar para Home</Link>
    </main>
  )
}
