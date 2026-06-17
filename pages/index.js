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
  const [leaderboard, setLeaderboard] = useState([])

  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Prehistooio Tier Engine v1.0. Reach 4,500 points to trigger popups!" }
  ])
  // 6-TIER SPECIES EVOLUTION EVOLUTION INDEX
  const evoTiers = [
    { name: "Sacabambaspis", label: "sacabambaspis.png", scale: 85, targetScore: 0 },
    { name: "Stethacanthus altonensis", label: "Stethacanthus altonensis.png", scale: 95, targetScore: 4500 },
    { name: "Squalicorax pristodontus", label: "Squalicorax pristodontus.png", scale: 105, targetScore: 9000 },
    { name: "Xiphiorhynchus kimblalocki", label: "Xiphiorhynchus kimblalocki.png", scale: 115, targetScore: 13500 },
    { name: "Liopleurodon ferox", label: "Liopleurodon ferox.png", scale: 130, targetScore: 18000 },
    { name: "Otodus megalodon", label: "Otodus megalodon.png", scale: 150, targetScore: 22500 }
  ]

  const [tierIndex, setTierIndex] = useState(0)
  const [nextTierReady, setNextTierReady] = useState(false)

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
  // SCORE MONITOR & POPUP NOTIFICATION INTERCEPTOR TRIGGER
  useEffect(() => {
    if (!isPlaying) return
    const nextIndex = tierIndex + 1
    if (nextIndex < evoTiers.length && score >= evoTiers[nextIndex].targetScore) {
      setNextTierReady(true)
    } else {
      setNextTierReady(false)
    }
  }, [score, tierIndex, isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    const pellets = []
    for (let c = 0; c < 8; c++) {
      const centerX = Math.floor(Math.random() * 2600) + 200
      const centerY = Math.floor(Math.random() * 1400) + 200
      for (let i = 0; i < 6; i++) {
        pellets.push({
          id: "std_" + c + "_" + i,
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
          id: "prm_" + c + "_" + i,
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
    let bots = [
      { name: "Apex_Megalodon", score: 24200 },
      { name: "TrenchHunter", score: 18100 },
      { name: "Helico_Bite", score: 13500 },
      { name: "Liopleurodon", score: 9800 },
      { name: "Shasta_Surfer", score: 4400 },
      { name: "Pliosaurus_Rex", score: 2900 },
      { name: "SwordFish_X", score: 1600 },
      { name: "Stetha_Fin", score: 800 },
      { name: "Squalicorax", score: 200 }
    ]
    const loop = () => {
      bots = bots.map(b => ({ ...b, score: b.score + (Math.random() > 0.6 ? 100 : 0) }))
      const list = [...bots, { name: username || "Guest", score: score, isMe: true }]
      list.sort((a, b) => b.score - a.score)
      setLeaderboard(list.slice(0, 10))
    }
    loop()
    const clock = setInterval(loop, 2500)
    return () => clearInterval(clock)
  }, [isPlaying, score, username])

  useEffect(() => {
    if (!isPlaying) return
    const mm = (e) => {
      if (!viewRef.current) return
      const rect = viewRef.current.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left - (rect.width / 2),
        y: e.clientY - rect.top - (rect.height / 2)
      }
    }
    window.addEventListener('mousemove', mm)
    return () => window.removeEventListener('mousemove', mm)
  }, [isPlaying])
    useEffect(() => {
    if (!isPlaying) return
    const engine = setInterval(() => {
      let cx = playerPosition.x
      let cy = playerPosition.y
      setPlayerPosition((p) => {
        const rad = Math.atan2(mousePos.current.y, mousePos.current.x)
        const dist = Math.sqrt(mousePos.current.x ** 2 + mousePos.current.y ** 2)
        const speed = dist > 25 ? Math.min(dist * 0.05, 8) : 0
        if (speed > 0) { setPlayerRotation(rad * (180 / Math.PI) + 90) }
        cx = Math.max(50, Math.min(2950, p.x + Math.cos(rad) * speed))
        cy = Math.max(50, Math.min(1725, p.y + Math.sin(rad) * speed))
        return { x: cx, y: cy }
      })
      setFoodPellets((prev) =>
        prev.map((f) => {
          if (f.isEaten) return f
          if (Math.sqrt((cx - f.x) ** 2 + (cy - f.y) ** 2) < 30) {
            setScore((s) => s + f.value)
            setTimeout(() => {
              setFoodPellets((curr) => curr.map((p) => p.id === f.id ? { ...p, x: getRandomCoord().x, y: getRandomCoord().y, isEaten: false } : p))
            }, 4000)
            return { ...f, isEaten: true }
          }
          return f
        })
      )
    }, 1000 / 60)
    return () => clearInterval(engine)
  }, [isPlaying, playerPosition])
    return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#104E8B', position: 'relative', overflowX: 'hidden', userSelect: 'none' }}>
      <Head>
        <title>Prehistooio</title>
        <link rel="icon" href="/icon.png?v=1" type="image/png" />
      </Head> 
      {isPlaying ? (
        <div className="arena-viewport" ref={viewRef}>
          <div style={{ position: 'absolute', top: '15px', left: '20px', fontFamily: 'sans-serif', fontSize: '0.9rem', opacity: 0.7, zIndex: 10, textAlign: 'left', lineHeight: '1.4' }}>
            <strong>PREHISTOOIO ARENA v1.0</strong><br />
            <span style={{ fontSize: '1.2rem', color: '#00FF1A', fontWeight: 'bold' }}>SCORE: {score}</span><br />
            <span style={{ fontSize: '0.85rem', color: '#FFD700' }}>SPECIES: {evoTiers[tierIndex].name}</span><br />
            Coordinates: X: {Math.round(playerPosition.x)} Y: {Math.round(playerPosition.y)}
          </div>
          
          <button className="leave-btn" style={{ top: 'auto', bottom: '185px', right: '15px' }} onClick={() => { setIsPlaying(false); setScore(0); setTierIndex(0); }}>Leave Map</button>

          {/* DYNAMIC CLICKABLE EVOLUTION INTERACTION POPUP PANEL */}
          {nextTierReady && (
            <div className="evolution-asset-panel-hud" onClick={() => {
              setTierIndex(prev => prev + 1);
              setScore(0); // Safely sets your local points state to 0 for a fresh rank-up pass!
            }}>
              <img src="/animal-evo.png" alt="Evolution Panel" style={{ width: '100%', height: '100%' }} />
              {/* Centers the upcoming species image inside the asset panel structure */}
              <img 
                src={"/" + evoTiers[tierIndex + 1].label} 
                alt="Next Tier Preview" 
                className="evo-sprite-centerpiece-anchor"
                onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }}
              />
            </div>
          )}

          <div className="hud-leaderboard-frame-container">
            <div style={{ position: 'relative', width: '100%' }}>
              <img src="/game-board.png" alt="Leaderboard" className="leaderboard-template-asset-graphic" onError={(e) => { e.target.src = "/leaderboard.png" }} />
              <div className="leaderboard-absolute-text-overlay-layer">
                {leaderboard.map((p, r) => {
                  let c = "#CCCCCC"; if (r === 0) c = "#7A5E00"; if (r === 1) c = "#444444"; if (r === 2) c = "#5C1D1D"; if (p.isMe) c = "#00FF1A";
                  return (
                    
                      <span>{(r + 1) + ". " + p.name}</span><span>{p.score}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
