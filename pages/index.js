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
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://googleapis.com');
        .ocean-title { font-family: 'Montserrat', sans-serif !important; }
        .ocean-sub { font-family: 'Montserrat', sans-serif !important; }
      `}} />

      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="ocean-title" style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Prehistooio
        </h1>
        
        <p className="ocean-sub" style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '2rem' }}>
          Made by Polentacze - Inspired by Deeeepio
        </p>
        
        <img 
          src="/deep-prehistoo.png" 
          alt="Prehistoo Creature" 
          style={{ width: '150px', height: 'auto', marginBottom: '2rem' }} 
        />

        <p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', maxWidth: '600px', lineHeight: '1.6' }}>
          Fight your Prehistoric foes
        </p>
      </main>
    </div>
  )
}
