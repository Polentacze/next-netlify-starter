import styles from '../styles/Home.module.css
import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Made by Polentacze-Inspired by Deeeepio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Prehistooio" />
  <p className={styles.description}>
          Get started by editing <code>pages/index.js</code>
        </p>
      </main>

      <Footer />
    </div>
  )
}
