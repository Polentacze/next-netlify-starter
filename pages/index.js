import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  // Swapped default preview asset target to point to your new prehistoric skeleton drawing
  const [currentSkin, setCurrentSkin] = useState('/prehistoric-skeleton.png')
  const [isWikiOpen, setIsWikiOpen] = useState(false)
  const [hoveredAnimal, setHoveredAnimal] = useState("")

  // Finely adjusted coordinates to line up perfectly with your drawn card rows
  const animalGridSlots = [
    { name: "Otodus megalodon", top: "16%", left: "9.5%", width: "13.5%", height: "28%" },
    { name: "Shastasaurus pacificus", top: "16%", left: "24.5%", width: "13.5%", height: "28%" },
    { name: "Pliosaurus funkei", top: "16%", left: "39.5%", width: "13.5%", height: "28%" },
    { name: "Helicoprion bessonowi", top: "16%", left: "54.5%", width: "13.5%", height: "28%" },
    { name: "Xiphiorhynchus kimblalocki", top: "16%", left: "69.5%", width: "13.5%", height: "28%" },
    { name: "Liopleurodon ferox", top: "16%", left: "84.5%", width: "13.5%", height: "28%" },
    { name: "Stethacanthus altonensis", top: "48%", left: "9.5%", width: "13.5%", height: "28%" },
    { name: "Squalicorax pristodontus", top: "48%", left: "24.5%", width: "13.5%", height: "28%" }
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

        .wiki-panel {
          width: 850px;
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

        /* Invisible overlay hitboxes positioned perfectly over your drawn cards */
        .qol-slot-overlay {
          position: absolute;
          cursor: pointer;
          border-radius: 14px;
          transition: all 0.15s ease-in-out;
          box-sizing: border-box;
          border: 3px solid transparent;
        }
        
        /* Your requested glowing neon green highlight border effect */
        .qol-slot-overlay:hover {
          border-color: #00FF1A !important;
          background-color: rgba(0, 255, 26, 0.08);
          box-shadow: 0 0 15px #00FF1A;
        }

        /* Scientific Name Banner layout display */
        .species-hud-display {
          margin-top: 1.5rem;
          background-color: #2a437a;
          padding: 1rem;
          border-radius: 16px;
          min-height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 3px solid rgba(255,255,255,0.15);
        }
      `}} />

      <img 
        src="/wiki-button.png" 
        alt="Animal Wiki Button" 
        className="wiki-image-trigger" 
        onClick={() => setIsWikiOpen(true)}
      />

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
            <img src="/AnimalGrid.png" alt="Animal Grid Layout" className="wiki-grid-graphic" />
            
            {/* Generating hover-sensitive grid hitboxes right over your drawing slots */}
            {animalGridSlots.map((slot, i) => (
              <div
                key={i}
                className="qol-slot-overlay"
                style={{
                  top: slot.top,
                  left: slot.left,
                  width: slot.width,
                  height: slot.height
                }}
                onMouseEnter={() => setHoveredAnimal(slot.name)}
                onMouseLeave={() => setHoveredAnimal("")}
              />
            ))}
          </div>

          {/* Species Tracker HUD displaying the full scientific names below the grid */}
          <div className="species-hud-display">
            <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: hoveredAnimal ? '#00FF1A' : '#ffffff', fontStyle: hoveredAnimal ? 'italic' : 'normal' }}>
              {hoveredAnimal ? hoveredAnimal : "Hover over a creature square to analyze scientific metadata"}
            </p>
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
        
        {/* Renders your custom skeleton picture asset inside the center focus slot */}
        <img 
          src={currentSkin} 
          alt="Prehistoric Skeleton Model" 
          style={{ width: '160px', height: 'auto', marginBottom: '2.5rem', borderRadius: '12px' }} 
          onError={(e) => {
            // Safe fallback text if prehistoric-skeleton.png isn't fully uploaded yet
            e.target.src = "/deep-prehistoo.png";
          }}
        />
        
        <p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', maxWidth: '600px', lineHeight: '1.6' }}>
          Fight your Prehistoric foes
        </p>
      </main>
    </div>
  )
}
