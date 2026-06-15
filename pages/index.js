import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Prehistooio</title>
        <link rel="icon" href="/icon.png?v=1" type="image/png" />
      </Head>

      <main>
        <Header title="Prehistooio" />
        <p>
          Made by Polentacze - Inspired by Deeeepio
        </p>
      </main>

      <Footer />
    </div>
  )
}
