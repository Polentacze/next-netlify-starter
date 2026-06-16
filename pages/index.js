import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [isWikiOpen, setIsWikiOpen] = useState(false)
  const [hoveredAnimal, setHoveredAnimal] = useState("")
  const [username, setUsername] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 1500, y: 1000 })
  const [playerRotation, setPlayerRotation] = useState(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const viewRef = useRef(null)

  const [score, setScore] = useState(0)
  const [foodPellets, setFoodPellets] = useState([])

  const [propsList, setPropsList] = useState({ kelp: [], volcano: null, bigRock: null })

  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Endless Food Matrix loaded. Gather clusters to rank up!" }
  ])
  const slots = ["Megalodon", "Shastasaurus", "Pliosaurus", "Helicoprion", "Xiphiorhynchus", "Liopleurodon", "Stethacanthus", "Squalicorax"]
  const slotPositions = [
    { t: "16%", l: "13.5%" }, { t: "16%", l: "24.7%" }, { t: "16%", l: "35.9%" }, { t: "16%", l: "47.1%" },
    { t: "16%", l: "58.3%" }, { t: "16%", l: "69.5%" }, { t: "48%", l: "13.5%" }, { t: "48%", l: "24.7%" }
  ]

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages((p) => [...p, { user: username || "Guest", text: chatInput }])
    setChatInput("")
  }

  const getRandomCoord = () => ({
    x: Math.floor(Math.random() * 2800) + 100,
    y: Math.floor(Math.random() * 1650) + 100
  })

  useEffect(() => {
    if (!isPlaying) return
    
    const pellets = []
    for (let c = 0; c < 8; c++) {
      const centerX = Math.floor(Math.random() * 2600) + 200
      const centerY = Math.floor(Math.random() * 1400) + 200
      for (let i = 0; i < 6; i++) {
        pellets.push({
          id: c + "_" + i,
          x: centerX + (Math.random() * 120 - 60),
          y: centerY + (Math.random() * 120 - 60),
          isEaten: false
        })
      }
    }
    setFoodPellets(pellets)

    // FIXED: Pushed the big rock position to 1755px so it matches the volcano grounding perfectly
    setPropsList({
      kelp: [
        { x: 600, y: 1755, h: 180 },
        { x: 1200, y: 1755, h: 210 },
        { x: 1800, y: 1755, h: 170 },
        { x: 2400, y: 1755, h: 230 }
      ],
      volcano: { x: 900, y: 1765, w: 110 },
      bigRock: { x: 2100, y: 1755, w: 160 }
    })
  }, [isPlaying])
    useEffect(() => {
    if (!isPlaying) return

    const handleMouseMove = (e) => {
      if (!viewRef.current) return
      const rect = viewRef.current.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left - (rect.width / 2),
        y: e.clientY - rect.top - (rect.height / 2)
      }
    }

    const gameLoop = setInterval(() => {
      let currentX = playerPosition.x
      let currentY = playerPosition.y

      setPlayerPosition((p) => {
        const angleRad = Math.atan2(mousePos.current.y, mousePos.current.x)
        const distance = Math.sqrt(mousePos.current.x ** 2 + mousePos.current.y ** 2)
        const speedMultiplier = distance > 25 ? Math.min(distance * 0.05, 8) : 0
        const dx = Math.cos(angleRad) * speedMultiplier
        const dy = Math.sin(angleRad) * speedMultiplier
        
        if (speedMultiplier > 0) {
          setPlayerRotation(angleRad * (180 / Math.PI) + 90)
        }
        currentX = Math.max(50, Math.min(2950, p.x + dx))
        currentY = Math.max(50, Math.min(1725, p.y + dy))
        return { x: currentX, y: currentY }
      })

      setFoodPellets((prevPellets) =>
        prevPellets.map((pellet) => {
          if (pellet.isEaten) return pellet
          const distanceToFood = Math.sqrt((currentX - pellet.x) ** 2 + (currentY - pellet.y) ** 2)
          if (distanceToFood < 30) {
            setScore((s) => s + 100)
            setTimeout(() => {
              setFoodPellets((currentPellets) =>
                currentPellets.map((p) => {
                  if (p.id === pellet.id) {
                    const newLoc = getRandomCoord()
                    return { ...p, x: newLoc.x, y: newLoc.y, isEaten: false }
                  }
                  return p
                })
              )
            }, 4000)
            return { ...pellet, isEaten: true }
          }
          return pellet
        })
      )
    }, 1000 / 60)

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(gameLoop)
    }
  }, [isPlaying, playerPosition, playerRotation])
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
        .launch-form { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; margin-top: 1rem; }
        .input-wrap { position: relative; width: 320px; }
        .play-btn { background: none; border: none; cursor: pointer; width: 180px; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3)); }
        .field-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; background: transparent; border: none; outline: none; color: #333333; font-size: 1.1rem; text-align: center; font-weight: bold; }
        .arena-viewport { width: 800px; height: 600px; background: #0b355e; border: 8px solid #2a437a; border-radius: 24px; position: relative; overflow: hidden; cursor: crosshair; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .infinite-ocean-world { position: absolute; width: 3000px; height: 2000px; background-color: #0b355e; background-image: linear-gradient(rgba(255, 255, 255, 0.04) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 2px, transparent 2px); background-size: 100px 100px; transition: transform 0.1s ease-out; }
        .leave-btn { position: absolute; top: 15px; right: 15px; background: #ff4d4d; border: 2px solid white; color: white; padding: 0.5rem 1rem; font-weight: bold; border-radius: 8px; cursor: pointer; z-index: 200; }
        .player-fish-sprite { width: 100%; height: auto; display: block; background: transparent !important; mix-blend-mode: normal !important; }
        .custom-food-sprite-pellet { position: absolute; width: 20px; height: auto; transform: translate(-50%, -50%); background-color: transparent !important; background: transparent !important; }
        .chat-container-hud { position: absolute; bottom: 15px; left: 15px; width: 250px; height: 160px; background: rgba(42, 67, 122, 0.85); border: 3px solid #2a437a; border-radius: 12px; display: flex; flex-direction: column; padding: 8px; z-index: 150; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        .chat-scroll-view { flex-grow: 1; overflow-y: auto; text-align: left; font-family: sans-serif; font-size: 0.8rem; margin-bottom: 6px; padding-right: 4px; }
        .chat-msg-row { margin-bottom: 4px; line-height: 1.3; word-break: break-word; }
        .chat-input-bar-inner { width: 100%; background-color: #104E8B; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; padding: 4px 8px; color: white; font-size: 0.8rem; outline: none; }
        .chat-input-bar-inner:focus { border-color: #00FF1A; }
        .gravel-seafloor-bed { position: absolute; bottom: 0px; left: 0px; width: 3000px; height: 260px; background-color: #5C4033; border-top: 8px solid #3d2b22; box-shadow: inset 0 10px 20px rgba(0,0,0,0.4); z-index: 30; }
        .scrolling-kelp-prop { position: absolute; transform: translate(-50%, -100%); width: 38px; z-index: 25; pointer-events: none; background: transparent !important; }
        .scrolling-volcano-prop { position: absolute; transform: translate(-50%, -100%); z-index: 28; pointer-events: none; background: transparent !important; }
        
        /* FIXED: Pushed layout origin down from top-left to bottom-anchor baseline */
        .scrolling-rock-prop { 
          position: absolute; 
          transform: translate(-50%, -100%); 
          z-index: 27; 
          pointer-events: none; 
          background: transparent !important; 
        }
      `}} />
      {isPlaying ? (
        <div className="arena-viewport" ref={viewRef}>
          <div style={{ position: 'absolute', top: '15px', left: '20px', fontFamily: 'sans-serif', fontSize: '0.9rem', opacity: 0.7, zIndex: 10, textAlign: 'left', lineHeight: '1.4' }}>
            <strong>PREHISTOOIO ARENA v0.7</strong><br />
            <span style={{ fontSize: '1.2rem', color: '#00FF1A', fontWeight: 'bold' }}>SCORE: {score}</span><br />
            Position Coordinates: X: {Math.round(playerPosition.x)} Y: {Math.round(playerPosition.y)}
          </div>
          <button className="leave-btn" onClick={() => { setIsPlaying(false); setScore(0); }}>Leave Map</button>

          <div className="chat-container-hud" onClick={(e) => e.stopPropagation()}>
            <div className="chat-scroll-view">
              {chatMessages.map((m, i) => (
                <div key={i} className="chat-msg-row"><strong style={{ color: m.user === "System" ? "#00FF1A" : "#FFD700" }}>{m.user}:</strong> {m.text}</div>
              ))}
            </div>
            <form onSubmit={handleSendChat}>
              <input type="text" className="chat-input-bar-inner" placeholder="Press Enter to type chat..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} maxLength={45} />
            </form>
          </div>
          
          <div className="infinite-ocean-world" style={{
            transform: 'translate(' + (400 - playerPosition.x) + 'px, ' + (300 - playerPosition.y) + 'px)'
          }}>
            <div className="gravel-seafloor-bed" />

            {propsList.kelp.map((k, idx) => {
              return (
                <img 
                  key={'k_' + idx}
                  src="/kelp.png"
                  alt="Sea Kelp"
                  className="scrolling-kelp-prop"
                  style={{ top: k.y, left: k.x, height: k.h }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )
            })}

            {propsList.volcano && (
              <img 
                src="/volcano.png"
                alt="Volcano Vent"
                className="scrolling-volcano-prop"
                style={{ top: propsList.volcano.y, left: propsList.volcano.x, width: propsList.volcano.w }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}

            {/* FIXED: Applied bottom-alignment logic matching your top-anchored layout rules */}
            {propsList.bigRock && (
              <img 
                src="/big-rock.png"
                alt="Big Rock"
                className="scrolling-rock-prop"
                style={{ top: propsList.bigRock.y + 15, left: propsList.bigRock.x, width: propsList.bigRock.w }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}

            {foodPellets.map((pellet) => !pellet.isEaten && (
              <img 
                key={pellet.id}
                src="/food.png"
                alt="Plankton Pellet"
                className="custom-food-sprite-pellet"
                style={{ top: pellet.y, left: pellet.x }}
              />
            ))}

            <div style={{ position: 'absolute', top: playerPosition.y, left: playerPosition.x, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px', pointerEvents: 'none', backgroundColor: 'transparent', background: 'transparent' }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'sans-serif', marginBottom: '8px', border: '1px solid #00FF1A', whiteSpace: 'nowrap' }}>
                {username || "Guest"}
              </span>
              <div style={{ width: '100%', transform: 'rotate(' + playerRotation + 'deg)', transition: 'transform 0.04s linear', backgroundColor: 'transparent', background: 'transparent' }}>
                <img src="/sacabambaspis.png" alt="Fish" className="player-fish-sprite" onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} />
              </div>
            </div>
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
                {slotPositions.map((p, i) => (
                  <div key={i} className="slot-over" style={{ top: p.t, left: p.l, width: "10.5%", height: "28%" }} onMouseEnter={() => setHoveredAnimal(slots[i])} onMouseLeave={() => setHoveredAnimal("")} />
                ))}
              </div>
              <div className="hud-banner">
                <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: hoveredAnimal ? '#00FF1A' : '#fff' }}>{hoveredAnimal || "Hover over a creature to analyze metadata"}</p>
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
              <button type="submit" className="play-btn"><img src="/play-button.png" alt="PLAY" style={{ width: '100%' }} /></button>
            </form>
          </main>
        </>
      )}
    </div>
  )
}
