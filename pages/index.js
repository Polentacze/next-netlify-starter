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

  // DYNAMIC LEADERBOARD SIMULATION MATRIX STATE
  const [leaderboard, setLeaderboard] = useState([])

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
          id: "standard_" + c + "_" + i,
          x: centerX + (Math.random() * 120 - 60),
          y: centerY + (Math.random() * 120 - 60),
          isEaten: false,
          type: "standard",
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
          type: "premium",
          value: 120,
          src: "/ocean-food.png"
        })
      }
    }
    setFoodPellets(pellets)

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
    // LOCAL LEADERBOARD COMPETITOR SIMULATOR LOOP
  useEffect(() => {
    if (!isPlaying) return

    // Generates 9 competing bot players with randomized default starting scores
    let simulatedBots = [
      { name: "Apex_Megalodon", score: 4200 },
      { name: "TrenchHunter", score: 3100 },
      { name: "Helico_Bite", score: 2500 },
      { name: "Liopleurodon", score: 1800 },
      { name: "Shasta_Surfer", score: 1400 },
      { name: "Pliosaurus_Rex", score: 900 },
      { name: "SwordFish_X", score: 600 },
      { name: "Stetha_Fin", score: 400 },
      { name: "Squalicorax", score: 200 }
    ]

    const updateLeaderboard = () => {
      // 1. Ticks bot scores up slowly to simulate real-time opponent competition
      simulatedBots = simulatedBots.map(bot => ({
        ...bot,
        score: bot.score + (Math.random() > 0.6 ? 100 : 0)
      }))

      // 2. Insert your current active user token into the comparison sorting pool
      const currentList = [
        ...simulatedBots,
        { name: username || "Guest", score: score, isMe: true }
      ]

      // 3. Sort rankings dynamically based on total score values
      currentList.sort((a, b) => b.score - a.score)
      setLeaderboard(currentList.slice(0, 10)) // Strict crop to Top 10 slots
    }

    updateLeaderboard()
    const rankingClock = setInterval(updateLeaderboard, 2500) // Re-evaluates positions every 2.5 seconds
    return () => clearInterval(rankingClock)
  }, [isPlaying, score, username])
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
            setScore((s) => s + pellet.value)
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
      {isPlaying ? (
        <div className="arena-viewport" ref={viewRef}>
          <div style={{ position: 'absolute', top: '15px', left: '20px', fontFamily: 'sans-serif', fontSize: '0.9rem', opacity: 0.7, zIndex: 10, textAlign: 'left', lineHeight: '1.4' }}>
            <strong>PREHISTOOIO ARENA v0.7</strong><br />
            <span style={{ fontSize: '1.2rem', color: '#00FF1A', fontWeight: 'bold' }}>SCORE: {score}</span><br />
            Coordinates: X: {Math.round(playerPosition.x)} Y: {Math.round(playerPosition.y)}
          </div>
          
          {/* LEAVE MAP SHIFTED TO THE BOTTOM CHAT RIM TO FREE UP THE UPPER RIGHT SPACE */}
          <button className="leave-btn" style={{ top: 'auto', bottom: '185px', right: '15px' }} onClick={() => { setIsPlaying(false); setScore(0); }}>Leave Map</button>

          {/* DYNAMIC LEADERBOARD TEMPLATE LAYER INTERFACE */}
          <div className="hud-leaderboard-frame-container">
            <div style={{ position: 'relative', width: '100%' }}>
              <img src="/leaderboard.png" alt="Leaderboard Scale" className="leaderboard-template-asset-graphic" />
              <div className="leaderboard-absolute-text-overlay-layer">
                {leaderboard.map((player, rank) => {
                  // Dynamic custom hex color assignments matching your template tiers
                  let rankColor = "#CCCCCC" // Default 4-10 stack gray text color
                  if (rank === 0) rankColor = "#7A5E00" // Tier 1 Gold card dark contrast contrast text
                  if (rank === 1) rankColor = "#444444" // Tier 2 Silver card contrast text
                  if (rank === 2) rankColor = "#5C1D1D" // Tier 3 Red card contrast text
                  if (player.isMe) rankColor = "#00FF1A" // Highlight your entry neon green

                  return (
                    
                      <span>{(rank + 1) + ". " + player.name}</span>
                      <span>{player.score}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

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
                src={pellet.src}
                alt="Ocean Plankton"
                className="custom-food-sprite-pellet"
                style={{ top: pellet.y, left: pellet.x }}
                onError={(e) => { e.target.src = "/food.png" }}
              />
            ))}

            <div style={{ position: 'absolute', top: playerPosition.y, left: playerPosition.x, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px', pointerEvents: 'none', backgroundColor: 'transparent', background: 'transparent' }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'sans-serif', marginBottom: '8px', border: '1px solid #00FF1A', whiteSpace: 'nowrap' }}>
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
              <button className="close-btn" onClick={() => setIsWikiOpen(true)}>Close X</button>
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
