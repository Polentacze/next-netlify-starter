import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [isWikiOpen, setIsWikiOpen] = useState(false)
  const [hoveredAnimal, setHoveredAnimal] = useState("")
  const [username, setUsername] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Real-time tracking physics vectors
  const [playerPosition, setPlayerPosition] = useState({ x: 400, y: 300 })
  const [playerRotation, setPlayerRotation] = useState(0) // Tracks cursor angle for rotational facing
  const mousePos = useRef({ x: 400, y: 300 })
  const arenaRef = useRef(null)

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

  useEffect(() => {
    if (!isPlaying) return

    const handleMouseMove = (e) => {
      if (!arenaRef.current) return
      const rect = arenaRef.current.getBoundingClientRect()
      
      // Strict localization limits movement coordinates to internal canvas dimensions
      mousePos.current = {
        x: Math.max(40, Math.min(760, e.clientX - rect.left)),
        y: Math.max(40, Math.min(560, e.clientY - rect.top))
      }
    }

    // High-precision mathematical loop processing physics updates at 60 FPS
    const gameLoop = setInterval(() => {
      setPlayerPosition((prev) => {
        const easeSpeed = 0.08 // Calibrated velocity glide matching Deeeep.io momentum
        const dx = mousePos.current.x - prev.x
        const dy = mousePos.current.y - prev.y
        
        // Updates facing angle rotation based on current mouse tracking vectors
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        setPlayerRotation(angle)

        return {
          x: prev.x + dx * easeSpeed,
          y: prev.y + dy * easeSpeed
        }
      })
    }, 1000 / 60)

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(gameLoop)
    }
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

        /* CRITICAL CONSTRAINT FIX: Hard limits play button proportions to a crisp 180px format */
        .custom-play-trigger-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          width: 180px !important; 
          height: auto !important;
          max-width: 180px !important;
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
          cursor: crosshair;
        }
        .hud-overlay-text {
          position: absolute;
          top: 15px;
          left: 20px;
          font-family: sans-serif;
          font-size: 0.9rem;
          opacity: 0.6;
          text-align: left;
          z-index: 10;
        }

        /* POSITION FIX: Anchors button into the absolute top-right rim with high priority stacking */
        .disconnect-btn {
          position: absolute;
          top: 15px !important;
          right: 15px !important;
          background-color: #ff4d4d;
          border: 2px solid white;
          color: white;
          padding: 0.5rem 1rem;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          z-index: 200 !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transition: background-color 0.2s;
        }
        .disconnect-btn:hover {
          background-color: #cc0000;
        }
      `}} />

      {isPlaying ? (
        <div className="arena-map-frame" ref={arenaRef}>
          <div className="hud-overlay-text">
            <strong>PREHISTOOIO MOVEMENT ARENA v0.3</strong><br/>
            Testing Model: sacabambaspis<br/>
            Controls: Aim your <strong>Mouse Cursor</strong> to glide smoothly
          </div>
          
          <button className="disconnect-btn" onClick={() => setIsPlaying(false)}>
            Leave Map
          </button>

          {/* Interactive Player Transform Component Entity */}
          <div style={{
            position: 'absolute',
            top: playerPosition.y - 45,
            left: playerPosition.x - 45,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90px',
            pointerEvents: 'none'
          }}>
            <span style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
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
            
            {/* Dynamic CSS Rotate property forces the box sprite to point straight at your cursor path vectors */}
            <img 
src="/sacabambaspis.png"alt="Sacabambaspis Test Model"style={{width: '100%',height: 'auto',transform: rotate(${playerRotation}deg),transition: 'transform 0.05s linear'}}onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }}/>) : (<><imgsrc="/wiki-button.png"alt="Animal Wiki Button"className="wiki-image-trigger"onClick={() => setIsWikiOpen(true)}/><divonClick={() => setIsWikiOpen(false)}style={{position: 'fixed',top: 0, left: 0, width: '100vw', height: '100vh',backgroundColor: 'rgba(0, 0, 0, 0.6)',display: isWikiOpen ? 'flex' : 'none',justifyContent: 'center', alignItems: 'center', zIndex: 105}}><div className="wiki-panel" onClick={(e) => { e.stopPropagation(); }}><button className="close-wiki-btn" onClick={() => setIsWikiOpen(true)}>Close X<h2 className="ocean-title" style={{ fontSize: '2.2rem', textAlign: 'left', margin: '0' }}>Animal Wiki{animalGridSlots.map((slot, i) => (<divkey={i}className="qol-slot-overlay"style={{ top: slot.top, left: slot.left, width: slot.width, height: slot.height }}onMouseEnter={() => setHoveredAnimal(slot.name)}onMouseLeave={() => setHoveredAnimal("")}/>))}<p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: hoveredAnimal ? '#00FF1A' : '#ffffff', fontStyle: hoveredAnimal ? 'italic' : 'normal' }}>{hoveredAnimal ? hoveredAnimal : "Hover over a creature square to analyze scientific metadata"}<main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><h1 className="ocean-title" style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Prehistooio<p className="ocean-sub" style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '1.5rem' }}>Made by Polentacze - Inspired by Deeeepio<img src="/prehistoric-skeleton.png" alt="Prehistoric Skeleton Model" style={{ width: '160px', height: 'auto', marginBottom: '1.5rem', borderRadius: '12px' }} onError={(e) => { e.target.src = "/deep-prehistoo.png" }} /><p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', maxWidth: '600px', lineHeight: '1.6', marginBottom: '0.5rem' }}>Fight your Prehistoric foes<form className="game-launch-form" onSubmit={(e) => { e.preventDefault(); setIsPlaying(true); }}><input type="text" className="hidden-text-field" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={14} /></>)})}
