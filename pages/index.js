import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [isWikiOpen, setIsWikiOpen] = useState(false)
  const [hoveredAnimal, setHoveredAnimal] = useState("")
  const [username, setUsername] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 400, y: 300 })
  const [playerRotation, setPlayerRotation] = useState(0)
  const mousePos = useRef({ x: 400, y: 300 })
  const arenaRef = useRef(null)

  const slots = [
    { name: "Otodus megalodon", t: "16%", l: "13.5%" },
    { name: "Shastasaurus pacificus", t: "16%", l: "24.7%" },
    { name: "Pliosaurus funkei", t: "16%", l: "35.9%" },
    { name: "Helicoprion bessonowi", t: "16%", l: "47.1%" },
    { name: "Xiphiorhynchus kimblalocki", t: "16%", l: "58.3%" },
    { name: "Liopleurodon ferox", t: "16%", l: "69.5%" },
    { name: "Stethacanthus altonensis", t: "48%", l: "13.5%" },
    { name: "Squalicorax pristodontus", t: "48%", l: "24.7%" }
  ]

  useEffect(() => {
    if (!isPlaying) return
    const handleMouseMove = (e) => {
      if (!arenaRef.current) return
      const rect = arenaRef.current.getBoundingClientRect()
      mousePos.current = {
        x: Math.max(40, Math.min(760, e.clientX - rect.left)),
        y: Math.max(40, Math.min(540, e.clientY - rect.top))
      }
    }
    const gameLoop = setInterval(() => {
      setPlayerPosition((p) => {
        const dx = mousePos.current.x - p.x
        const dy = mousePos.current.y - p.y
        setPlayerRotation(Math.atan2(dy, dx) * (180 / Math.PI))
        return { x: p.x + dx * 0.15, y: p.y + dy * 0.15 }
      })
    }, 1000 / 60)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(gameLoop)
    }
  }, [isPlaying])

  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#104E8B', position: 'relative', overflowX: 'hidden', userSelect: 'none' }}>
      <Head>
        <title>Prehistooio</title>
        <link rel="icon" href="/icon.png?v=1" type="image/png" />
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://googleapis.com');
        .ocean-title { font-family: 'Rye', serif !important; }
        .ocean-sub { font-family: 'Rye', serif !important; }
        .wiki-img { position: fixed; right: 0px; top: 50%; transform: translateY(-50%); width: 220px; cursor: pointer; z-index: 100; filter: drop-shadow(-5px 5px 10px rgba(0,0,0,0.3)); }
        .wiki-panel { width: 850px; background-color: #3b5ca8; border: 6px solid #2a437a; border-radius: 28px; padding: 2rem; position: relative; }
        .close-btn { background-color: #ff4d4d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: bold; cursor: pointer; position: absolute; top: 1.5rem; right: 1.5rem; z-index: 120; }
        .grid-container { position: relative; width: 100%; margin-top: 1.5rem; }
        .grid-img { width: 100%; display: block; border-radius: 16px; }
        .slot-over { position: absolute; cursor: pointer; border-radius: 14px; transition: all 0.15s; border: 3px solid transparent; }
        .slot-over:hover { border-color: #00FF1A !important; background: rgba(0, 255, 26, 0.08); box-shadow: 0 0 15px #00FF1A; }
        .hud-banner { margin-top: 1.5rem; background: #2a437a; padding: 1rem; border-radius: 16px; min-height: 60px; display: flex; justifyContent: center; alignItems: center; border: 3px solid rgba(255,255,255,0.15); }
        .launch-form { display: flex; flexDirection: column; alignItems: center; gap: 1.2rem; margin-top: 1rem; }
        .input-wrap { position: relative; width: 320px; }
        .play-btn { background: none; border: none; cursor: pointer; width: 180px; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3)); }
        .field-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; background: transparent; border: none; outline: none; color: #333333; font-size: 1.1rem; text-align: center; font-weight: bold; }
        .arena-frame { width: 800px; height: 600px; background: #0b355e; border: 8px solid #2a437a; border-radius: 24px; position: relative; overflow: hidden; cursor: crosshair; }
        .leave-btn { position: absolute; top: 15px; right: 15px; background: #ff4d4d; border: 2px solid white; color: white; padding: 0.5rem 1rem; font-weight: bold; border-radius: 8px; cursor: pointer; z-index: 200; }
      `}} />

      {isPlaying ? (
        <div className="arena-frame" ref={arenaRef}>
          <div style={{ position: 'absolute', top: '15px', left: '20px', fontFamily: 'sans-serif', fontSize: '0.9rem', opacity: 0.6, textAlign: 'left', zIndex: 10 }}>
            <strong>PREHISTOOIO ARENA v0.3</strong><br/>
            Handle: {username || "Guest"}<br/>
            Move cursor to swim smoothly
          </div>
          <button className="leave-btn" onClick={() => setIsPlaying(false)}>Leave Map</button>
          <div style={{ position: 'absolute', top: playerPosition.y - 45, left: playerPosition.x - 45, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px', pointerEvents: 'none' }}>
            <span style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'sans-serif', marginBottom: '5px', border: '1px solid #00FF1A' }}>
              sacabambaspis ({username || "Guest"})
            </span>
            <img src="/sacabambaspis.png" alt="Fish" style={{ width: '100%', transform: 'rotate(' + playerRotation + 'deg)' }} onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} />
          </div>
        </div>
      ) : (
        <>
          <img src="/leaderboard.png" alt="Leaderboard" style={{ position: 'fixed', left: '25px', top: '50%', transform: 'translateY(-50%)', width: '240px', zIndex: 100 }} />
          <img src="/wiki-button.png" alt="Wiki" className="wiki-img" onClick={() => setIsWikiOpen(true)} />

          <div onClick={() => setIsWikiOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: isWikiOpen ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 105 }}>
            <div className="wiki-panel" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setIsWikiOpen(false)}>Close X</button>
              <h2 className="ocean-title" style={{ fontSize: '2.2rem', textAlign: 'left', margin: '0' }}>Animal Wiki</h2>
              <div className="grid-container">
                <img src="/AnimalGrid.png" alt="Grid" className="grid-img" />
                {slots.map((s, i) => (
                  <div key={i} className="slot-over" style={{ top: s.t, left: s.l, width: "10.5%", height: "28%" }} onMouseEnter={() => setHoveredAnimal(s.name)} onMouseLeave={() => setHoveredAnimal("")} />
                ))}
              </div>
              <div className="hud-banner">
                <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: hoveredAnimal ? '#00FF1A' : '#fff' }}>
                  {hoveredAnimal || "Hover over a creature to analyze metadata"}
                </p>
              </div>
            </div>
          </div>

          <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="ocean-title" style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Prehistooio</h1>
            <p className="ocean-sub" style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '1.5rem' }}>Made by Polentacze - Inspired by Deeeepio</p>
            <img src="/prehistoric-skeleton.png" alt="Skeleton" style={{ width: '160px', marginBottom: '1.5rem', borderRadius: '12px' }} onError={(e) => { e.target.src = "/deep-prehistoo.png" }} />
            <p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', marginBottom: '0.5rem' }}>Fight your Prehistoric foes</p>
            <form className="launch-form" onSubmit={(e) => { e.preventDefault(); setIsPlaying(true); }}>
              <div className="input-wrap">
                <img src="/input-box.png" alt="Input" style={{ width: '100%' }} />
                <input type="text" className="field-text" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={14} />
              </div>
              <button type="submit" className="play-btn">
                <img src="/play-button.png" alt="PLAY" style={{ width: '100%' }} />
              </button>
            </form>
          </main>
        </>
      )}
    </div>
  )
}
