'use client'
import { BounceLoader } from 'react-spinners'
import styles from './page.module.css'

export default function Loading(){
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Loading...</h1>
            <BounceLoader color='#ffffff' size={128} className={styles.loading}/>
        </main>
    )
}