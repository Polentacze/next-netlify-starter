import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [currentSkin, setCurrentSkin] = useState('/prehistoric-skeleton.png')
  const [isWikiOpen, setIsWikiOpen] = useState(false)
  const [hoveredAnimal, setHoveredAnimal] = useState("")
  
  // Game input tracking variables
  const [username, setUsername] = useState("")

  // Kept your wiki board coordinates safe for later
  const animalGridSlots = [
    { name: "Otodus megalodon", top: "16%", left: "13.5%", width: "10.5%", height: "28%" },
    { name: "Shastasaurus pacificus", top: "16%", left: "24.7%", width: "10.5%", height: "28%" },
    { name: "Pliosaurus funkei", top: "16%", left: "35.9%", width: "10.5%", height: "28%" },
    { name: "Helicoprion bessonowi", top: "16%", left: "47.1%", width: "10.5%", height: "28%" },
    { name: "Xiphiorhynchus kimblalocki", top: "16%", left: "58.3%", width: "10.5%", height: "28%" },
    { name: "Liopleurodon ferox", top: "16%", left: "69.5%", width: "10.5%", height: "28%" },
    { name: "Stethacanthus altonensis", top: "48%", left: "13.5%", width: "10.5%", height: "28%" },
    { name: "Squalicorax pristodontus", top: "48%", left: "24.7%", width: "10.5%", height: "28%" }
  ]

  const handlePlayGame = (e) => {
    e.preventDefault()
    alert(`Connecting as "${username || 'Prehistoo_Fish'}"... Entering the arena!`)
  }

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

        .qol-slot-overlay {
          position: absolute;
          cursor: pointer;
          border-radius: 14px;
          transition: all 0.15s ease-in-out;
          box-sizing: border-box;
          border: 3px solid transparent;
          background-color: transparent !important; 
        }
        .qol-slot-overlay:hover {
          border-color: #00FF1A !important;
          background-color: rgba(0, 255, 26, 0.08) !important;
          box-shadow: 0 0 15px #00FF1A;
        }

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

        .game-launch-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          margin-top: 1rem;
        }

        .custom-input-wrapper {
          position: relative;
          width: 320px; 
          height: auto;
        }

        .input-bg-graphic {
          width: 100%;
          height: auto;
          display: block;
        }

        .hidden-text-field {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%; 
          background: transparent;
          border: none;
          outline: none;
          color: #333333 !important; 
          font-size: 1.1rem;
          font-family: sans-serif;
          text-align: center;
          font-weight: bold;
        }

        .custom-play-trigger-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          width: 200px; 
          transition: transform 0.2s ease;
          filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3));
        }
        .custom-play-trigger-btn:hover {
          transform: scale(1.05); 
        }
        
        .play-graphic-asset {
          width: 100%;
          height: auto;
          display: block;
        }

        /* POSITION HANDLER FOR YOUR CUSTOM LEADERBOARD DRAWING */
        .custom-leaderboard-graphic {
          position: fixed;
          left: 25px; 
          top: 50%;
          transform: translateY(-50%);
          width: 240px; 
          height: auto;
          z-index: 100;
          filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.3));
        }
      `}} />

      {/* Renders your custom leaderboard artwork asset on the left edge */}
      <img 
        src="/leaderboard.png" 
        alt="The Predator of Prehistoo" 
        className="custom-leaderboard-graphic" 
      />

      {/* Floating Explore trigger sitting on the right edge */}
      <img 
        src="/wiki-button.png" 
        alt="Animal Wiki Button" 
        className="wiki-image-trigger" 
        onClick={() => setIsWikiOpen(true)}
      />

      {/* Wiki Modal Backdrop Box */}
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

          <div className="species-hud-display">
            <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: hoveredAnimal ? '#00FF1A' : '#ffffff', fontStyle: hoveredAnimal ? 'italic' : 'normal' }}>
              {hoveredAnimal ? hoveredAnimal : "Hover over a creature square to analyze scientific metadata"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Home Launch Screen View */}
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="ocean-title" style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Prehistooio
        </h1>
        <p className="ocean-sub" style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '1.5rem' }}>
          Made by Polentacze - Inspired by Deeeepio
        </p>
        
        <img 
          src={currentSkin} 
          alt="Prehistoric Skeleton Model" 
          style={{ width: '160px', height: 'auto', marginBottom: '1.5rem', borderRadius: '12px' }} 
          onError={(e) => {
            e.target.src = "/deep-prehistoo.png";
          }}
        />

        <p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', maxWidth: '600px', lineHeight: '1.6', marginBottom: '0.5rem' }}>
          Fight your Prehistoric foes
        </p>

        {/* Pure Image-Driven Entry Form Area */}
        <form className="game-launch-form" onSubmit={handlePlayGame}>
          <div className="custom-input-wrapper">
            <img src="/input-box.png" alt="Username Input Frame" className="input-bg-graphic" />
            <input 
              type="text" 
              className="hidden-text-field" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={14}
            />
          </div>

          <button type="submit" className="custom-play-trigger-btn">
            <img src="/play-button.png" alt="PLAY GAME" className="play-graphic-asset" />
          </button>
        </form>
      </main>
    </div>
  )
}
