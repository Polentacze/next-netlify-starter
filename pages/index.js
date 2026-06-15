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

      {/* This raw tag injects the stylesheet directly into the app body */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://googleapis.com');
        .game-title { font-family: 'Press Start 2P', cursive !important; }
        .game-sub { font-family: 'Press Start 2P', cursive !important; font-size: 0.8rem; opacity: 0.8; }
      `}} />

      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="game-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          Prehistooio
        </h1>
        
        <p className="game-sub" style={{ marginBottom: '2.5rem' }}>
          Battle with your prehistoric foes
        </p>
        
        <img 
          src="/deep-prehistoo.png" 
          alt="Prehistoo Creature" 
          style={{ width: '150px', height: 'auto' }} 
        />
      </main>
    </div>
  )
}
