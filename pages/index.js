import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Prehistooio</title>
      </Head>

      <main>
        <Header title="Prehistooio" />
        <p>
          Made by Polentacze - Inspired by Deeeepio.
        </p>
      </main>

      <Footer />
    </div>
  )
}
