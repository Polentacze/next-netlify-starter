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

  const [boostBars, setBoostBars] = useState(3) 
  const [foodEatenCount, setFoodEatenCount] = useState(0) 
  const [isBoosting, setIsBoosting] = useState(false)

  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Chat Color Matrix online! Type (RED), (BLUE), (GREEN), or (CYAN) to style your logs.", colorCode: "#00FF1A" }
  ])
    const slots = ["Megalodon", "Shastasaurus", "Pliosaurus", "Helicoprion", "Xiphiorhynchus", "Liopleurodon", "Stethacanthus", "Squalicorax"]
  const slotPositions = [
    { t: "16%", l: "13.5%" }, { t: "16%", l: "24.7%" }, { t: "16%", l: "35.9%" }, { t: "16%", l: "47.1%" },
    { t: "16%", l: "58.3%" }, { t: "16%", l: "69.5%" }, { t: "48%", l: "13.5%" }, { t: "48%", l: "24.7%" }
  ]

  // DYNAMIC COLOR DICTIONARY ENGINE
  const detectTextColor = (targetString) => {
    const cleanStr = (targetString || "").toUpperCase()
    if (cleanStr.includes("(RED)")) return "#ff4d4d"
    if (cleanStr.includes("(BLUE)")) return "#3b82f6"
    if (cleanStr.includes("(GREEN)")) return "#00FF1A"
    if (cleanStr.includes("(CYAN)")) return "#00ffff"
    return "#FFFFFF" // Standard white fallback text color
  }

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    // Scans both the text input string and your name tag to choose priority color layers
    let messageColor = detectTextColor(chatInput)
    if (messageColor === "#FFFFFF") messageColor = detectTextColor(username)

    setChatMessages((p) => [...p, { 
      user: username || "Guest", 
      text: chatInput,
      colorCode: messageColor
    }])
    setChatInput("")
  }

  const getRandomCoord = () => ({
    x: Math.floor(Math.random() * 2800) + 100,
    y: Math.floor(Math.random() * 1650) + 100
  })

  const handleViewportClick = () => {
    if (boostBars < 1 || isBoosting) return
    setIsBoosting(true)
    setBoostBars(0) 

    setTimeout(() => {
      setIsBoosting(false)
    }, 300)
  }

  useEffect(() => {
    if (!isPlaying) return
    
    const pellets = []
    for (let c = 0; c < 8; c++) {
      const centerX = Math.floor(Math.random() * 2600) + 200
      const centerY = Math.floor(Math.random() * 1400) + 200
      for (let i = 0; i < 6; i++) {
        pellets.push({
          id: "standard_" + c + "_" + i,
          x: centerX + (Math.random() * 120 - 60),
          y: centerY + (Math.random() * 120 - 60),
          isEaten: false,
          value: 100,
          src: "/food.png"
        })
      }
    }
    for (let c = 0; c < 4; c++) {
      const centerX = Math.floor(Math.random() * 2600) + 200
      const centerY = Math.floor(Math.random() * 1400) + 200
      for (let i = 0; i < 4; i++) {
        pellets.push({
          id: "premium_" + c + "_" + i,
          x: centerX + (Math.random() * 120 - 60),
          y: centerY + (Math.random() * 120 - 60),
          isEaten: false,
          value: 120,
          src: "/ocean-food.png"
        })
      }
    }
    setFoodPellets(pellets)

    setPropsList({
      kelp: [
        { x: 600, y: 1755, h: 180 }, { x: 1200, y: 1755, h: 210 },
        { x: 1800, y: 1755, h: 170 }, { x: 2400, y: 1755, h: 230 }
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
        
        let speedMultiplier = distance > 25 ? Math.min(distance * 0.05, 8) : 0
        if (isBoosting) speedMultiplier = 28 

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
            setScore((s) => s + pellet.value)

            setFoodEatenCount((prevCount) => {
              const nextCount = prevCount + 1
              if (nextCount >= 5) {
                setBoostBars((bars) => Math.min(3, bars + 1)) 
                return 0 
              }
              return nextCount
            })
            
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
  }, [isPlaying, playerPosition, playerRotation, isBoosting, boostBars])
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
        .slot-over { position: absolute; cursor: pointer; border-radius: 14px; transition: all 0.15s; border: 3px solid transparent !important; background-color: transparent !important; background: transparent !important; }
        .slot-over:hover { border-color: #00FF1A !important; background: rgba(0, 255, 26, 0.08) !important; box-shadow: 0 0 15px #00FF1A; }
        .hud-banner { margin-top: 1.5rem; background: #2a437a; padding: 1rem; border-radius: 16px; min-height: 60px; display: flex; justifyContent: center; alignItems: center; border: 3px solid rgba(255,255,255,0.15); }
        .launch-form { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; margin-top: 1rem; }
        .input-wrap { position: relative; width: 320px; }
        .play-btn { background: none; border: none; cursor: pointer; width: 180px; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3)); }
        .field-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; background: transparent; border: none; outline: none; color: #333333; font-size: 1.1rem; text-align: center; font-weight: bold; }
        .arena-viewport { width: 800px; height: 600px; background: #0b355e; border: 8px solid #2a437a; border-radius: 24px; position: relative; overflow: hidden; cursor: crosshair; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .infinite-ocean-world { position: absolute; width: 3000px; height: 2000px; background-color: #0b355e; background-image: linear-gradient(rgba(255, 255, 255, 0.04) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 2px, transparent 2px); background-size: 100px 100px; transition: transform 0.1s ease-out; }
        .leave-btn { position: absolute; top: 15px; background: #ff4d4d; border: 2px solid white; color: white; padding: 0.5rem 1rem; font-weight: bold; border-radius: 8px; cursor: pointer; z-index: 200; }
        .player-fish-sprite { width: 100%; height: auto; display: block; background: transparent !important; mix-blend-mode: normal !important; }
        .custom-food-sprite-pellet { position: absolute; width: 20px !important; height: auto !important; transform: translate(-50%, -50%); background-color: transparent !important; background: transparent !important; }
        .chat-container-hud { position: absolute; bottom: 15px; left: 15px; width: 250px; height: 160px; background: rgba(42, 67, 122, 0.85); border: 3px solid #2a437a; border-radius: 12px; display: flex; flex-direction: column; padding: 8px; z-index: 150; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        .chat-scroll-view { flex-grow: 1; overflow-y: auto; text-align: left; font-family: sans-serif; font-size: 0.8rem; margin-bottom: 6px; padding-right: 4px; }
        .chat-msg-row { margin-bottom: 4px; line-height: 1.3; word-break: break-word; }
        .chat-input-bar-inner { width: 100%; background-color: #104E8B; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; padding: 4px 8px; color: white; font-size: 0.8rem; outline: none; }
        .chat-input-bar-inner:focus { border-color: #00FF1A; }
        .gravel-seafloor-bed { position: absolute; bottom: 0px; left: 0px; width: 3000px; height: 260px; background-color: #5C4033; border-top: 8px solid #3d2b22; box-shadow: inset 0 10px 20px rgba(0,0,0,0.4); z-index: 30; }
        .scrolling-kelp-prop { position: absolute; transform: translate(-50%, -100%); width: 38px; z-index: 25; pointer-events: none; background: transparent !important; }
        .scrolling-volcano-prop { position: absolute; transform: translate(-50%, -100%); width: 110px; z-index: 28; pointer-events: none; background: transparent !important; }
        .scrolling-rock-prop { position: absolute; transform: translate(-50%, -100%); width: 160px; z-index: 27; pointer-events: none; background: transparent !important; }

        .hud-boost-ammunition-deck {
          position: absolute;
          top: 85px;
          right: 20px;
          display: flex;
          flex-direction: column-reverse; 
          gap: 6px;
          width: 18px;
          height: auto;
          background: rgba(0,0,0,0.4);
          padding: 6px 4px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.15);
          z-index: 190;
        }
        .individual-energy-slice {
          width: 100%;
          height: 32px; 
          border-radius: 3px;
          border: 1px solid rgba(0,0,0,0.6);
          transition: background-color 0.15s ease-out, box-shadow 0.15s;
        }
      `}} />
      {isPlaying ? (
        <div className="arena-viewport" ref={viewRef} onMouseDown={handleViewportClick}>
          <div style={{ position: 'absolute', top: '15px', left: '20px', fontFamily: 'sans-serif', fontSize: '0.9rem', opacity: 0.7, zIndex: 10, textAlign: 'left', lineHeight: '1.4' }}>
            <strong>PREHISTOOIO ARENA v0.7</strong><br />
            <span style={{ fontSize: '1.2rem', color: '#00FF1A', fontWeight: 'bold' }}>SCORE: {score}</span>
          </div>
          
          <button className="leave-btn" style={{ right: '20px' }} onClick={(e) => { e.stopPropagation(); setIsPlaying(false); setScore(0); }}>Leave Map</button>

          <div className="hud-boost-ammunition-deck">
            <div className="individual-energy-slice" style={{ backgroundColor: boostBars >= 1 ? '#00FF1A' : 'rgba(255,255,255,0.12)', boxShadow: boostBars >= 1 ? '0 0 8px #00FF1A' : 'none' }} />
            <div className="individual-energy-slice" style={{ backgroundColor: boostBars >= 2 ? '#00FF1A' : 'rgba(255,255,255,0.12)', boxShadow: boostBars >= 2 ? '0 0 8px #00FF1A' : 'none' }} />
            <div className="individual-energy-slice" style={{ backgroundColor: boostBars >= 3 ? '#00FF1A' : 'rgba(255,255,255,0.12)', boxShadow: boostBars >= 3 ? '0 0 8px #00FF1A' : 'none' }} />
          </div>

          <div className="chat-container-hud" style={{ zIndex: 150 }} onClick={(e) => e.stopPropagation()}>
            <div className="chat-scroll-view">
              {chatMessages.map((m, i) => (
                /* FIXED TYPOGRAPHY MAP: Implements the active colorCode property directly onto message logs row formatting rules */
                <div key={i} className="chat-msg-row" style={{ color: m.colorCode || '#FFFFFF' }}>
                  <strong style={{ color: detectTextColor(m.user) !== '#FFFFFF' ? detectTextColor(m.user) : m.user === "System" ? "#00FF1A" : "#FFD700" }}>
                    {m.user}:
                  </strong>{" "}{m.text}
                </div>
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

            {propsList.bigRock && (
              <img 
                src="/big-rock.png"
                alt="Big Rock"
                className="scrolling-rock-prop"
                style={{ top: propsList.bigRock.y + 25, left: propsList.bigRock.x, width: propsList.bigRock.w }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}

            {foodPellets.map((pellet) => !pellet.isEaten && (
              <img 
                key={pellet.id}
                src={pellet.src || "/food.png"}
                alt="Plankton Pellet"
                className="custom-food-sprite-pellet"
                style={{ top: pellet.y, left: pellet.x }}
                onError={(e) => { e.target.src = "/food.png" }}
              />
            ))}

            {/* FIXED NAME TAG COLOR ATTACHMENT RULE */}
            <div style={{ position: 'absolute', top: playerPosition.y, left: playerPosition.x, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px', pointerEvents: 'none', backgroundColor: 'transparent', background: 'transparent' }}>
              <span style={{ 
                background: 'rgba(0,0,0,0.7)', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                fontFamily: 'sans-serif', 
                marginBottom: '8px', 
                border: '1px solid ' + (detectTextColor(username) !== '#FFFFFF' ? detectTextColor(username) : '#00FF1A'), 
                color: detectTextColor(username),
                whiteSpace: 'nowrap' 
              }}>
                {username || "Guest"}
              </span>
              <div style={{ width: '100%', transform: 'rotate(' + playerRotation + 'deg)', transition: 'transform 0.04s linear', backgroundColor: 'transparent', background: 'transparent' }}>
                <img 
                  src={(username || "").toUpperCase().replace(/\s/g, "").includes("(GHOUL)") ? "/ghoul.png" : "/sacabambaspis.png"} 
                  alt="Player Creature" 
                  className="player-fish-sprite" 
                  onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} 
                />
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
                {slots.map((s, i) => (
                  <div key={i} className="slot-over" style={{ top: slotPositions[i].t, left: slotPositions[i].l, width: "10.5%", height: "28%" }} onMouseEnter={() => setHoveredAnimal(slots[i])} onMouseLeave={() => setHoveredAnimal("")} />
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
                <input type="text" className="field-text" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={14} placeholder="Enter Name..." style={{ color: '#333' }} />
              </div>
              <button type="submit" className="play-btn"><img src="/play-button.png" alt="PLAY" style={{ width: '100%' }} /></button>
            </form>
          </main>
        </>
      )}
    </div>
  )
}
