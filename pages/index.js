import Head from 'next/head'

export default function Home() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem', 
      color: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#104E8B'
    }}>
      <Head>
        <title>Prehistooio</title>
        <link rel="icon" href="/icon.png?v=1" type="image/png" />
        {/* This injects the font link directly into the page header */}
        <link rel="preconnect" href="https://googleapis.com" />
        <link rel="preconnect" href="https://gstatic.com" crossOrigin="anonymous" />
        <link href="https://googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Every text tag below has the font family locked in directly */}
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Prehistooio
        </h1>
        
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.1rem', opacity: '0.8', marginBottom: '2rem' }}>
          Battle with your prehistoric foes
        </p>
        
        <img 
          src="/deep-prehistoo.png" 
          alt="Prehistoo Creature" 
          style={{ width: '120px', height: 'auto', marginBottom: '2rem' }} 
        />

      
      </main>
    </div>
  )
}
