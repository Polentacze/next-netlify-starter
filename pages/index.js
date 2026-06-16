import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [currentSkin, setCurrentSkin] = useState('/deep-prehistoo.png')
  const [isWikiOpen, setIsWikiOpen] = useState(false)

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
      backgroundColor: '#104E8B',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <Head>
        <title>Prehistooio</title>
        <link rel="icon" href="/icon.png?v=1" type="image/png" />
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://googleapis.com');
        .ocean-title { font-family: 'Rye', serif !important; }
        .ocean-sub { font-family: 'Rye', serif !important; }
        
        /* Positions your custom button card perfectly on the very right wall */
        .wiki-image-trigger {
          position: fixed;
          right: 0px; 
          top: 50%;
          transform: translateY(-50%);
          width: 220px;
          height: auto;
          cursor: pointer;
          z-index: 100;
          transition: transform 0.2s ease;
          filter: drop-shadow(-5px 5px 10px rgba(0,0,0,0.3));
        }
        .wiki-image-trigger:hover {
          transform: translateY(-50%) scale(1.05);
        }

        /* Responsive popup container hosting your AnimalGrid artwork */
        .wiki-panel {
          width: 800px;
          background-color: #3b5ca8; 
          border: 6px solid #2a437a;  
          border-radius: 28px;       
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
          padding: 2rem;
          position: relative;
        }

        .close-wiki-btn {
          background-color: #ff4d4d;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 120;
        }

        .grid-image-container {
          position: relative;
          width: 100%;
          margin-top: 1.5rem;
        }

        .wiki-grid-graphic {
          width: 100%;
          height: auto;
          border-radius: 16px;
          display: block;
        }
      `}} />

      {/* Floating Explore trigger sitting on the right edge */}
      <img 
        src="/wiki-button.png" 
        alt="Animal Wiki Button" 
        className="wiki-image-trigger" 
        onClick={() => setIsWikiOpen(true)}
      />

      {/* Full Screen Overlay Panel Layer */}
      <div 
        onClick={() => setIsWikiOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: isWikiOpen ? 'flex' : 'none', 
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 105
        }}
      >
        <div className="wiki-panel" onClick={(e) => e.stopPropagation()}>
          <button className="close-wiki-btn" onClick={() => setIsWikiOpen(false)}>Close X</button>
          <h2 className="ocean-title" style={{ fontSize: '2.2rem', textAlign: 'left', margin: '0' }}>
            Animal Wiki
          </h2>
          
          <div className="grid-image-container">
            {/* Swapped to your new filename AnimalGrid.png */}
            <img src="/AnimalGrid.png" alt="Animal Grid Layout" className="wiki-grid-graphic" />
          </div>
        </div>
      </div>

      {/* Main launch screen area */}
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="ocean-title" style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Prehistooio
        </h1>
        <p className="ocean-sub" style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '2.5rem' }}>
          Made by Polentacze - Inspired by Deeeepio
        </p>
        <img 
          src={currentSkin} 
          alt="Prehistoo Creature" 
          style={{ width: '150px', height: 'auto', marginBottom: '2.5rem', borderRadius: '12px' }} 
        />
        <p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', maxWidth: '600px', lineHeight: '1.6' }}>
          Fight your Prehistoric foes
        </p>
      </main>
    </div>
  )
}
