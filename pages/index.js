import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [currentSkin, setCurrentSkin] = useState('/deep-prehistoo.png')
  const [isWikiOpen, setIsWikiOpen] = useState(false)
  const [hoveredAnimal, setHoveredAnimal] = useState("")

  // Exact grid coordinates mapping your 8 uploaded prehistoric species
  const animalGridSlots = [
    { name: "CMegalodon", top: "18%", left: "15%", width: "10%", height: "18%" },
    { name: "Shastasaurus", top: "18%", left: "27%", width: "10%", height: "18%" },
    { name: "PliosaurusF", top: "18%", left: "39%", width: "10%", height: "18%" },
    { name: "Helicoprion", top: "18%", left: "51%", width: "10%", height: "18%" },
    { name: "Xiphiorhynchus", top: "18%", left: "63%", width: "10%", height: "18%" },
    { name: "Liopleurodon", top: "18%", left: "75%", width: "10%", height: "18%" },
    { name: "Stethacanthus", top: "45%", left: "15%", width: "10%", height: "18%" },
    { name: "SqualicoraxK", top: "45%", left: "27%", width: "10%", height: "18%" }
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
        
        /* Positions your wiki button perfectly on the very right wall */
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

        /* Full screen dimming backdrop - hidden completely on launch */
        .wiki-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.6); 
          display: \${isWikiOpen ? 'flex' : 'none'}; 
          justify-content: center;
          align-items: center;
          z-index: 105;
        }

        /* Responsive popup dashboard framework container hosting Grid.png */
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

        /* Layout canvas bounding box map */
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

        /* Invisible overlay boxes matching your background slots precisely */
        .invisible-slot-trigger {
          position: absolute;
          background-color: rgba(0, 255, 26, 0); /* Transparent */
          cursor: pointer;
          border-radius: 8px;
          transition: background-color 0.2s;
        }
        .invisible-slot-trigger:hover {
          background-color: rgba(0, 255, 26, 0.15); /* Slight green glow when hovering */
          border: 2px solid #00FF1A;
        }

        .hud-name-banner {
          margin-top: 1.5rem;
          background-color: #2a437a;
          padding: 1rem;
          border-radius: 12px;
          min-height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid rgba(255,255,255,0.1);
        }
      `}} />

      {/* Floating launch card sitting on the right edge */}
      <img 
        src="/wiki-button.png" 
        alt="Animal Wiki Button" 
        className="wiki-image-trigger" 
        onClick={() => setIsWikiOpen(true)}
      />

      {/* Full Screen Interactive Modal Viewport */}
      <div className="wiki-modal-overlay" onClick={() => setIsWikiOpen(false)}>
        <div className="wiki-panel" onClick={(e) => e.stopPropagation()}>
          <button className="close-wiki-btn" onClick={() => setIsWikiOpen(false)}>Close X</button>
          <h2 className="ocean-title" style={{ fontSize: '2.2rem', textAlign: 'left', margin: '0' }}>
            Animal Wiki
          </h2>
          
          <div className="grid-image-container">
            <img src="/Grid.png" alt="Animal Grid Layout" className="wiki-grid-graphic" />
            
            {/* Hot-mapping custom click triggers directly over your Grid art slots */}
            {animalGridSlots.map((slot, i) => (
              <div
                key={i}
                className="invisible-slot-trigger"
                style={{
                  top: slot.top,
                  left: slot.left,
                  width: slot.width,
                  height: slot.height
                }}
                onMouseEnter={() => setHoveredAnimal(slot.name)}
                onMouseLeave={() => setHoveredAnimal("")}
                onClick={() => {
                  // If you have matching skins, clicking can equip them here!
                  alert("Selected: " + slot.name);
                }}
              />
            ))}
          </div>

          {/* Clean status HUD at the bottom showing which creature box you are over */}
          <div className="hud-name-banner">
            <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1.2rem', fontWeight: 'bold', color: hoveredAnimal ? '#00FF1A' : '#ffffff' }}>
              {hoveredAnimal ? hoveredAnimal : "Hover over a square slot to scan creature metadata"}
            </p>
          </div>
        </div>
      </div>

      {/* Main launch environment dashboard screen area */}
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
