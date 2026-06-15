import Head from 'next/head'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <Head>
        <title>Prehistooio</title>
        <link rel="icon" href="/icon.png?v=1" type="image/png" />
      </Head>

      <main style={{ marginTop: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>
          Prehistooio
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: '0.9', marginBottom: '2rem' }}>
          Made by Polentacze - Inspired by Deeeepio
        </p>
      </main>

      <Footer />
    </div>
  )
}
