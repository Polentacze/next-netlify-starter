import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [currentSkin, setCurrentSkin] = useState('/deep-prehistoo.png')
  const [isWikiOpen, setIsWikiOpen] = useState(false)

  // This matches your actual uploaded file list perfectly for copy-pasting!
  const animalNames = [
    "CMegalodon", "Helicoprion", "Liopleurodon", "PliosaurusF", 
    "Shastasaurus", "SqualicoraxK", "Stethacanthus", "Xiphiorhynchus"
  ]

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
        
        /* Floating layout handler for your uploaded wiki-button image */
        .wiki-image-trigger {
          position: fixed;
          right: 25px;
          top: 50%;
          transform: translateY(-50%);
          width: 220px;
          height: auto;
          cursor: pointer;
          z-index: 100;
          transition: transform 0.2s ease;
          filter: drop-shadow(0 10px 15px rgba(0,0,0,0.4));
        }
        .wiki-image-trigger:hover {
          transform: translateY(-50%) scale(1.05);
        }

        /* Large Grid Panel matching your blue asset proportions exactly */
        .wiki-panel {
          position: fixed;
          top: 50%;
          right: \${isWikiOpen ? '50%' : '-700px'};
          transform: \${isWikiOpen ? 'translate(50%, -50%)' : 'translate(0, -50%)'}; 
          width: 580px;
          max-height: 90vh;
          background-color: #3b5ca8; 
          border: 6px solid #2a437a;  
          border-radius: 28px;       
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 105;
          padding: 2rem;
          overflow-y: auto; /* Allows scrolling down if the screen is small */
        }

        .close-wiki-btn {
          background-color: #ff4d4d;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          float: right;
        }

        /* Image styling that allows zooming on your Grid graphic */
        .wiki-grid-graphic {
          width: 100%;
          height: auto;
          border-radius: 16px;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.4);
          transition: transform 0.3s ease;
        }
        
        /* Zoom-in feature when clicking or holding click over the main grid graphic */
        .wiki-grid-graphic:active {
          transform: scale(1.3);
          z-index: 110;
          cursor: zoom-out;
        }

        /* Clean list layout for copying and pasting animal text */
        .text-list-container {
          background-color: #2a437a;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: left;
          border: 2px solid rgba(255,255,255,0.1);
        }

        .animal-text-item {
          display: inline-block;
          background-color: #104E8B;
          padding: 0.4rem 0.8rem;
          margin: 0.3rem;
          border-radius: 6px;
          font-family: sans-serif;
          font-size: 0.95rem;
          border: 1px solid rgba(255,255,255,0.2);
          user-select: all; /* Makes the entire name select automatically when clicked */
          cursor: text;
        }
      `}} />

      {/* Clickable Wiki Trigger Image Card */}
      <img 
        src="/wiki-button.png" 
        alt="Animal Wiki Button" 
        className="wiki-image-trigger" 
        onClick={() => setIsWikiOpen(true)}
      />

      {/* Sliding Wiki Index Board Display Panel */}
      <div className="wiki-panel">
        <button className="close-wiki-btn" onClick={() => setIsWikiOpen(false)}>Close ✕</button>
        <h2 className="ocean-title" style={{ fontSize: '2rem', textAlign: 'left', margin: '0' }}>
          Animal Wiki
        </h2>
        
        {/* Renders your exact Grid.png graphic sheet directly */}
        <img 
          src="/Grid.png" 
          alt="Animal Grid Layout" 
          className="wiki-grid-graphic" 
          title="Hold click to zoom in!"
        />

        {/* Copy-Paste Text Area at the bottom */}
        <div className="text-list-container">
          <h4 style={{ margin: '0 0 0.8rem 0', fontFamily: 'sans-serif', fontSize: '1.1rem', opacity: '0.9' }}>
            Species Register (Click to Select Text):
          </h4>
          <div>
            {animalNames.map((name, i) => (
              <span key={i} className="animal-text-item">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

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
