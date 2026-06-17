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

  // EVOLUTION LOOP MODES AND TIERS SYSTEM CONFIGURATION
  const [currentTierIndex, setCurrentTierIndex] = useState(0) // Track which chain stage you are on
  const [showEvoWindow, setShowEvoWindow] = useState(false)   // Controls the animal-evo popup tray view

  const evolutionChain = [
    { name: "Sacabambaspis", scale: 80, sprite: "/sacabambaspis.png" },
    { name: "Stethacanthus altonensis", scale: 95, sprite: "/Stethacanthus-altonensis.png" },
    { name: "Squalicorax Pristodontus", scale: 110, sprite: "/Squalicorax-Pristodontus.png" },
    { name: "Xiphiorhynchus kimblalocki", scale: 125, sprite: "/Xiphiorhynchus-kimblalocki.png" },
    { name: "Liopleurodon Ferox", scale: 145, sprite: "/Liopleurodon-Ferox.png" }, // Bigger model hitbox
    { name: "Otodus Megalodon", scale: 175, sprite: "/Otodus-Megalodon.png" }       // Premium top apex scale
  ]

  const [leaderboard, setLeaderboard] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Evolution HUD Matrix Active! Each tier requires 2,500 score points." }
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

  // REALTIME SCORE TRIGGER MILESTONE SCANNER
  useEffect(() => {
    if (!isPlaying) return
    
    // Calculates what your tier index *should* be based on exactly 2,500 points intervals
    const targetTierIndex = Math.min(Math.floor(score / 2500), evolutionChain.length - 1)
    
    // If you qualify for a higher animal tier and haven't chosen to evolve it yet, flash open the evo window popup panel!
    if (targetTierIndex > currentTierIndex && !showEvoWindow) {
      setShowEvoWindow(true)
    }
  }, [score, isPlaying, currentTierIndex])
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
          useEffect(() => {
    if (!isPlaying) return

    let simulatedBots = [
      { name: "Apex_Megalodon", score: 12500 },
      { name: "TrenchHunter", score: 9100 },
      { name: "Helico_Bite", score: 6500 },
      { name: "Liopleurodon", score: 4800 },
      { name: "Shasta_Surfer", score: 3400 },
      { name: "Pliosaurus_Rex", score: 2100 },
      { name: "SwordFish_X", score: 1600 },
      { name: "Stetha_Fin", score: 800 },
      { name: "Squalicorax", score: 200 }
    ]

    const updateLeaderboard = () => {
      simulatedBots = simulatedBots.map(bot => ({
        ...bot,
        score: bot.score + (Math.random() > 0.65 ? 100 : 0)
      }))

      const currentList = [
        ...simulatedBots,
        { name: username || "Guest", score: score, isMe: true }
      ]

      currentList.sort((a, b) => b.score - a.score)
      setLeaderboard(currentList.slice(0, 10))
    }

    updateLeaderboard()
    const rankingClock = setInterval(updateLeaderboard, 2500)
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
            <span style={{ fontSize: '0.85rem', color: '#FFD700', textTransform: 'uppercase' }}>SPECIES: {evolutionChain[currentTierIndex].name}</span><br />
            Coordinates: X: {Math.round(playerPosition.x)} Y: {Math.round(playerPosition.y)}
          </div>
          
          <button className="leave-btn" style={{ top: 'auto', bottom: '185px', right: '15px' }} onClick={() => { setIsPlaying(false); setScore(0); setCurrentTierIndex(0); setShowEvoWindow(false); }}>Leave Map</button>

          {/* DYNAMIC INTERACTIVE CHOOSE EVOLUTION WINDOW PROPS BOX LAYER */}
          {showEvoWindow && currentTierIndex < evolutionChain.length - 1 && (
            <div className="hud-evolution-window-popup-tray">
              <div style={{ position: 'relative', width: '100%' }}>
                <img src="/animal-evo.png" alt="Evo Banner" style={{ width: '100%', display: 'block' }} />
                
                {/* INTERACTIVE CHOICE CORE TRIGGER HOVER OVERLAY BUTTON */}
                <div 
                  className="evo-card-image-anchor-btn" 
                  title={"Click to Evolve into " + evolutionChain[currentTierIndex + 1].name}
                  onClick={() => {
                    setCurrentTierIndex(prev => prev + 1) // Advance to the next matched species tier index
                    setShowEvoWindow(false)               // Slide away the notification tray until next milestone
                  }}
                >
                  <img 
                    src={evolutionChain[currentTierIndex + 1].sprite} 
                    alt="Next Up Option" 
                    className="evo-embedded-inner-preview-sprite" 
                    onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="hud-leaderboard-frame-container">
            <div style={{ position: 'relative', width: '100%' }}>
              <img src="/game-board.png" alt="Leaderboard Scale" className="leaderboard-template-asset-graphic" onError={(e) => { e.target.src = "/leaderboard.png" }} />
              <div className="leaderboard-absolute-text-overlay-layer">
                {leaderboard.map((player, rank) => {
                  let rankColor = "#CCCCCC" 
                  if (rank === 0) rankColor = "#7A5E00" 
                  if (rank === 1) rankColor = "#444444" 
                  if (rank === 2) rankColor = "#5C1D1D" 
                  if (player.isMe) rankColor = "#00FF1A" 

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

            {/* DYNAMIC PLAYER ELEMENT WINDOW: Responsive scale and case-matched sprite linking variables */}
            <div style={{ 
              position: 'absolute', 
              top: playerPosition.y, 
              left: playerPosition.x, 
              transform: 'translate(-50%, -50%)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              width: evolutionChain[currentTierIndex].scale + 'px', 
              pointerEvents: 'none' 
            }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'sans-serif', marginBottom: '8px', border: '1px solid #00FF1A', whiteSpace: 'nowrap' }}>
                {username || "Guest"}
              </span>
              <div style={{ width: '100%', transform: 'rotate(' + playerRotation + 'deg)', transition: 'transform 0.04s linear', backgroundColor: 'transparent', background: 'transparent' }}>
                <img 
                  src={(username || "").toUpperCase().replace(/\s/g, "").includes("(GHOUL)") ? "/ghoul.png" : evolutionChain[currentTierIndex].sprite} 
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
              <h2 className="ocean-title"
