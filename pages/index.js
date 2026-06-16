import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isWikiOpen, setIsWikiOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 300, y: 300 })

  useEffect(() => {
    if (!isPlaying) return

    const handleKeyDown = (e) => {
      const step = 15
      setPlayerPosition((prev) => {
        let newX = prev.x
        let newY = prev.y
        
        if (e.key === 'ArrowUp' || e.key === 'w') newY = Math.max(80, prev.y - step)
        if (e.key === 'ArrowDown' || e.key === 's') newY = Math.min(520, prev.y + step)
        if (e.key === 'ArrowLeft' || e.key === 'a') newX = Math.max(50, prev.x - step)
        if (e.key === 'ArrowRight' || e.key === 'd') newX = Math.min(750, prev.x + step)
        
        return { x: newX, y: newY }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying])

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
      overflowX: 'hidden',
      userSelect: 'none'
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

        .custom-leaderboard-graphic {
          position: fixed;
          left: 25px; 
          top: 50%;
          transform: translateY(-50%);
          width: 240px; 
          height: auto;
          z-index: 100;
        }

        .arena-map-frame {
          width: 800px;
          height: 600px;
          background-color: #0b355e; 
          border: 8px solid #2a437a;
          border-radius: 24px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .hud-overlay-text {
          position: absolute;
          top: 15px;
          left: 20px;
          font-family: sans-serif;
          font-size: 0.9rem;
          opacity: 0.6;
          text-align: left;
        }
        .disconnect-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          background-color: #ff4d4d;
          border: none;
          color: white;
          padding: 0.4rem 0.8rem;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
        }
      `}} />

      {isPlaying ? (
        <div className="arena-map-frame">
          <div className="hud-overlay-text">
            <strong>PREHISTOOIO SANDBOX SERVER v0.1</strong><br/>
            Player Handle: {username || "Guest_Fish"}<br/>
            Controls: Use <strong>W, A, S, D</strong> or <strong>Arrow Keys</strong> to swim
          </div>
          
          <button className="disconnect-btn" onClick={() => setIsPlaying(false)}>
            Leave Map
          </button>

          <div style={{
            position: 'absolute',
            top: playerPosition.y,
            left: playerPosition.x,
            transition: 'all 0.1s linear',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90px'
          }}>
            <span style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              marginBottom: '5px',
              whiteSpace: 'nowrap',
              border: '1px solid #00FF1A'
            }}>
              sacabambaspis ({username || "Guest"})
            </span>
            
            <img 
              src="/sacabambaspis.png" 
              alt="Sacabambaspis Test Model" 
              style={{ width: '100%', height: 'auto' }}
              onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }}
            />
          </div>
        </div>
      ) : (
        <>
          <img 
            src="/leaderboard.png" 
            alt="The Predator of Prehistoo" 
            className="custom-leaderboard-graphic" 
          />

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
              top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: isWikiOpen ? 'flex' : 'none', 
              justifyContent: 'center', alignItems: 'center', zIndex: 105
            }}
          >
            <div className="wiki-panel" onClick={(e) => e.stopPropagation()}>
              <button className="close-wiki-btn" onClick={() => setIsWikiOpen(false)}>Close X</button>
              <h2 className="ocean-title" style={{ fontSize: '2.2rem', textAlign: 'left', margin: '0' }}>Animal Wiki</h2>
              <div className="grid-image-container">
                <img src="/AnimalGrid.png" alt="Animal Grid Layout" className="wiki-grid-graphic" />
              </div>
            </div>
          </div>

          <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="ocean-title" style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Prehistooio</h1>
            <p className="ocean-sub" style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '1.5rem' }}>Made by Polentacze - Inspired by Deeeepio</p>
            
            <img src="/prehistoric-skeleton.png" alt="Prehistoric Skeleton Model" style={{ width: '160px', height: 'auto', marginBottom: '1.5rem', borderRadius: '12px' }} onError={(e) => { e.target.src = "/deep-prehistoo.png" }} />
            <p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', maxWidth: '600px', lineHeight: '1.6', marginBottom: '0.5rem' }}>Fight your Prehistoric foes</p>

            <form className="game-launch-form" onSubmit={(e) => { e.preventDefault(); setIsPlaying(true); }}>
              <div className="custom-input-wrapper">
                <img src="/input-box.png" alt="Username Input Frame" className="input-bg-graphic" />
                <input type="text" className="hidden-text-field" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={14} />
              </div>
              <button type="submit" className="custom-play-trigger-btn">
                <img src="/play-button.png" alt="PLAY GAME" className="play-graphic-asset" />
              </button>
            </form>
          </main>
        </>
      )}
    </div>
  )
}
