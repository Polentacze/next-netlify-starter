import Head from 'next/head'

export default function Home() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem', 
      fontFamily: 'Montserrat, sans-serif',
      color: '#FFFFFF'
    }}>
      <Head>
        <title>Prehistooio</title>
        <link rel="icon" href="/icon.png?v=1" type="image/png" />
      </Head>

      <main style={{ marginTop: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Prehistooio
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '1.5rem' }}>
          Made by Polentacze - Inspired by Deeeepio
        </p>
        
        <p style={{ fontSize: '1.4rem', fontWeight: '500', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Made by Polentacze - Inspired by Deeeepio
        </p>
      </main>
    </div>
  )
}
