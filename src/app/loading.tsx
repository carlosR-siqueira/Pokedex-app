'use client'
import { ProgressBar } from 'react-loader-spinner'
import styles from './page.module.css';


export default function Loading(){
    return (
        <main className={styles.main}>
            <h1 className={styles.titleLoading}>Carregando...</h1>
            <ProgressBar  
            height="200"
            width="200"
            margin-top='0' 
            />
        </main>
    )
}