import Head from 'next/head'

export default function Home() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem', 
      fontFamily: 'Montserrat, sans-serif',
      color: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Head>
        <title>Prehistooio</title>
        <link rel="icon" href="/icon.png?v=1" type="image/png" />
      </Head>

      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Prehistooio
        </h1>
        
        <p style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '2rem' }}>
          Made by Polentacze - Inspired by Deeeepio
        </p>
        
        <img 
          src="/deep-prehistoo.png" 
          alt="Prehistoo Creature" 
          style={{ width: '120px', height: 'auto', marginBottom: '2rem' }} 
        />

        </p>
      </main>
    </div>
  )
}
