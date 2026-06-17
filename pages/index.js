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

  // EVOLUTION WINDOW & STATE MANAGEMENT TIERS
  const [currentTierIndex, setCurrentTierIndex] = useState(0)
  const [isEvoWindowOpen, setIsEvoWindowOpen] = useState(false)
  const lastEvolvedMilestone = useRef(0)

  // Explicit mapping array pointing directly to your case-sensitive file storage names
  const evolutionChain = [
    { name: "Sacabambaspis", sprite: "/sacabambaspis.png", scale: 90 },
    { name: "Stethacanthus altonensis", sprite: "/Stethacanthus-altonensis.png", scale: 100 },
    { name: "Squalicorax pristodontus", sprite: "/Squalicorax-Pristodontus.png", scale: 112 },
    { name: "Xiphiorhynchus kimblalocki", sprite: "/Xiphiorhynchus-kimblalocki.png", scale: 125 },
    { name: "Liopleurodon Ferox", sprite: "/Liopleurodon-Ferox.png", scale: 140 },
    { name: "Otodus Megalodon", sprite: "/Otodus-Megalodon.png", scale: 170 }
  ]

  const [leaderboard, setLeaderboard] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Evolution & Local Leaderboard tracking profiles active!" }
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

  // CHECKPOINT MONITOR: Checks if you accumulated an extra 2500 points to show the card modal box
  useEffect(() => {
    if (!isPlaying) return
    
    const targetMilestone = (lastEvolvedMilestone.current + 1) * 2500
    if (score >= targetMilestone && lastEvolvedMilestone.current < evolutionChain.length - 1) {
      lastEvolvedMilestone.current += 1
      setIsEvoWindowOpen(true) // Freezes tracking to open the choice popup frame card container overlay
    }
  }, [score, isPlaying])
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
      { name: "Apex_Megalodon", score: 14200 },
      { name: "TrenchHunter", score: 9100 },
      { name: "Helico_Bite", score: 6500 },
      { name: "Liopleurodon", score: 4800 },
      { name: "Shasta_Surfer", score: 3400 },
      { name: "Pliosaurus_Rex", score: 2100 },
      { name: "SwordFish_X", score: 1200 },
      { name: "Stetha_Fin", score: 400 },
      { name: "Squalicorax", score: 200 }
    ]

    const updateLeaderboard = () => {
      simulatedBots = simulatedBots.map(bot => ({
        ...bot,
        score: bot.score + (Math.random() > 0.7 ? 120 : 0)
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
      // Freeze steering rotation physics changes when evolution selection prompt panel is resting open
      if (isEvoWindowOpen) return

      mousePos.current = {
        x: e.clientX - rect.left - (rect.width / 2),
        y: e.clientY - rect.top - (rect.height / 2)
      }
    }

    const gameLoop = setInterval(() => {
      let currentX = playerPosition.x
      let currentY = playerPosition.y

      setPlayerPosition((p) => {
        if (isEvoWindowOpen) return p // Halts velocity momentum shifts during choice mode screens

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
  }, [isPlaying, playerPosition, playerRotation, isEvoWindowOpen])
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
            <span style={{ fontSize: '0.85rem', color: '#FFD700' }}>SPECIES: {evolutionChain[currentTierIndex].name}</span><br />
            Coordinates: X: {Math.round(playerPosition.x)} Y: {Math.round(playerPosition.y)}
          </div>
          
          <button className="leave-btn" style={{ top: 'auto', bottom: '185px', right: '15px' }} onClick={() => { setIsPlaying(false); setScore(0); setCurrentTierIndex(0); lastEvolvedMilestone.current = 0; }}>Leave Map</button>

          {/* DYNAMIC LEADERBOARD TEMPLATE */}
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

          {/* 🧬 DEEEEP.IO INTERACTIVE EVOLUTION SELECTION PANEL WINDOW */}
          {isEvoWindowOpen && currentTierIndex < evolutionChain.length - 1 && (
            <div className="evo-ui-center-alert-container" onClick={(e) => e.stopPropagation()}>
              <div style={{ position: 'relative', width: '100%' }}>
                <img src="/animal-evo.png" alt="Evolve Card" style={{ width: '100%', display: 'block' }} />
                <button className="evo-skip-dismiss-cross-btn" onClick={() => setIsEvoWindowOpen(false)}>Skip X</button>
                
                {/* Center hit zone box: Clicking this triggers your mutation evolution transforms */}
                <div className="evo-click-bubble-trigger" onClick={() => {
                  setCurrentTierIndex((prev) => prev + 1)
                  setIsEvoWindowOpen(false)
                }}>
                  <img 
                    src={evolutionChain[currentTierIndex + 1].sprite} 
                    alt="Next Species" 
                    className="evo-inner-preview-graphic" 
                    onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }}
                  />
                  <div className="evo-prompt-title-subtext">
                    Evolve to {evolutionChain[currentTierIndex + 1].name}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                <img key={'k_' + idx} src="/kelp.png" alt="Sea Kelp" className="scrolling-kelp-prop" style={{ top: k.y, left: k.x, height: k.h }} onError={(e) => { e.target.style.display = 'none' }} />
              )
            })}

            {propsList.volcano && (
              <img src="/volcano.png" alt="Volcano Vent" className="scrolling-volcano-prop" style={{ top: propsList.volcano.y, left: propsList.volcano.x, width: propsList.volcano.w }} onError={(e) => { e.target.style.display = 'none' }} />
            )}

            {propsList.bigRock && (
              <img src="/big-rock.png" alt="Big Rock" className="scrolling-rock-prop" style={{ top: propsList.bigRock.y + 25, left: propsList.bigRock.x, width: propsList.bigRock.w }} onError={(e) => { e.target.style.display = 'none' }} />
            )}

            {foodPellets.map((pellet) => !pellet.isEaten && (
              <img key={pellet.id} src={pellet.src} alt="Ocean Plankton" className="custom-food-sprite-pellet" style={{ top: pellet.y, left: pellet.x }} onError={(e) => { e.target.src = "/food.png" }} />
            ))}

            {/* DYNAMIC AVATAR TRACKER: Bound precisely to the live evolution chain matrix scales */}
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
              <span style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight:
