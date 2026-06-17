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

  // 🐳 6-TIER EVOLUTION DATA TABLE WITH PRECISE HIGHER HITBOX SCALES
  const evoTiers = [
    { name: "Sacabambaspis", minScore: 0, scale: 80, file: "/sacabambaspis.png" },
    { name: "Stethacanthus altonensis", minScore: 4500, scale: 95, file: "/Stethacanthus altonensis.png" },
    { name: "Squalicorax pristodontus", minScore: 9000, scale: 110, file: "/Squalicorax pristodontus.png" },
    { name: "Xiphiorhynchus kimblalocki", minScore: 13500, scale: 125, file: "/Xiphiorhynchus kimblalocki.png" },
    { name: "Liopleurodon ferox", minScore: 18000, scale: 145, file: "/Liopleurodon ferox.png" },
    { name: "Otodus megalodon", minScore: 22500, scale: 165, file: "/Otodus megalodon.png" }
  ]

  const [activeTierIndex, setActiveTierIndex] = useState(0)
  const [pendingEvolutionIndex, setPendingEvolutionIndex] = useState(null)

  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([{ user: "System", text: "Evolution HUD restored. 4500 points (45 pellets) required per tier upgrade!" }])
    const slots = ["Megalodon", "Shastasaurus", "Pliosaurus", "Helicoprion", "Xiphiorhynchus", "Liopleurodon", "Stethacanthus", "Squalicorax"]
  const slotPositions = [{ t: "16%", l: "13.5%" }, { t: "16%", l: "24.7%" }, { t: "16%", l: "35.9%" }, { t: "16%", l: "47.1%" }, { t: "16%", l: "58.3%" }, { t: "16%", l: "69.5%" }, { t: "48%", l: "13.5%" }, { t: "48%", l: "24.7%" }]

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages((p) => [...p, { user: username || "Guest", text: chatInput }])
    setChatInput("")
  }

  const getRandomCoord = () => ({ x: Math.floor(Math.random() * 2800) + 100, y: Math.floor(Math.random() * 1650) + 100 })

  useEffect(() => {
    if (!isPlaying) return
    const pellets = []
    for (let c = 0; c < 8; c++) {
      const cx = Math.floor(Math.random() * 2600) + 200, cy = Math.floor(Math.random() * 1400) + 200
      for (let i = 0; i < 6; i++) pellets.push({ id: `s_${c}_${i}`, x: cx + (Math.random() * 120 - 60), y: cy + (Math.random() * 120 - 60), isEaten: false, value: 100, src: "/food.png" })
    }
    for (let c = 0; c < 4; c++) {
      const cx = Math.floor(Math.random() * 2600) + 200, cy = Math.floor(Math.random() * 1400) + 200
      for (let i = 0; i < 4; i++) pellets.push({ id: `p_${c}_${i}`, x: cx + (Math.random() * 120 - 60), y: cy + (Math.random() * 120 - 60), isEaten: false, value: 120, src: "/ocean-food.png" })
    }
    setFoodPellets(pellets)
    setPropsList({ kelp: [{ x: 600, y: 1755, h: 180 }, { x: 1200, y: 1755, h: 210 }, { x: 1800, y: 1755, h: 170 }, { x: 2400, y: 1755, h: 230 }], volcano: { x: 900, y: 1765, w: 110 }, bigRock: { x: 2100, y: 1755, w: 160 } })
  }, [isPlaying])
    useEffect(() => {
    if (!isPlaying) return
    const nextIndex = activeTierIndex + 1
    if (nextIndex < evoTiers.length && score >= evoTiers[nextIndex].minScore) {
      if (pendingEvolutionIndex !== nextIndex) setPendingEvolutionIndex(nextIndex)
    }
  }, [score, activeTierIndex, isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    let bots = [{ name: "Apex_Megalodon", score: 26000 }, { name: "TrenchHunter", score: 19500 }, { name: "Helico_Bite", score: 14200 }, { name: "Liopleurodon", score: 11000 }, { name: "Shasta_Surfer", score: 8500 }, { name: "Pliosaurus_Rex", score: 5100 }, { name: "SwordFish_X", score: 3200 }, { name: "Stetha_Fin", score: 1200 }, { name: "Squalicorax", score: 400 }]
    const loop = () => {
      bots = bots.map(b => ({ ...b, score: b.score + (Math.random() > 0.65 ? 100 : 0) }))
      const list = [...bots, { name: username || "Guest", score: score, isMe: true }]
      list.sort((a, b) => b.score - a.score)
      setLeaderboard(list.slice(0, 10))
    }
    loop()
    const timer = setInterval(loop, 2500)
    return () => clearInterval(timer)
  }, [isPlaying, score, username])
    useEffect(() => {
    if (!isPlaying) return
    const mm = (e) => {
      if (!viewRef.current) return
      const rect = viewRef.current.getBoundingClientRect()
      mousePos.current = { x: e.clientX - rect.left - (rect.width / 2), y: e.clientY - rect.top - (rect.height / 2) }
    }
    const tick = setInterval(() => {
      let cx = playerPosition.x, cy = playerPosition.y
      setPlayerPosition((p) => {
        const rad = Math.atan2(mousePos.current.y, mousePos.current.x), dist = Math.sqrt(mousePos.current.x ** 2 + mousePos.current.y ** 2)
        const spd = dist > 25 ? Math.min(dist * 0.05, 8) : 0
        if (spd > 0) setPlayerRotation(rad * (180 / Math.PI) + 90)
        cx = Math.max(50, Math.min(2950, p.x + Math.cos(rad) * spd))
        cy = Math.max(50, Math.min(1725, p.y + Math.sin(rad) * spd))
        return { x: cx, y: cy }
      })
      setFoodPellets((prev) => prev.map((f) => {
        if (f.isEaten) return f
        if (Math.sqrt((cx - f.x) ** 2 + (cy - f.y) ** 2) < 30) {
          setScore((s) => s + f.value)
          setTimeout(() => {
            setFoodPellets((cur) => cur.map((p) => {
              if (p.id === f.id) { const loc = getRandomCoord(); return { ...p, x: loc.x, y: loc.y, isEaten: false } }
              return p
            }))
          }, 4000)
          return { ...f, isEaten: true }
        }
        return f
      }))
    }, 1000 / 60)
    window.addEventListener('mousemove', mm)
    return () => { window.removeEventListener('mousemove', mm); clearInterval(tick) }
  }, [isPlaying, playerPosition])
    return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#104E8B', position: 'relative', overflowX: 'hidden', userSelect: 'none' }}>
      <Head><title>Prehistooio</title><link rel="icon" href="/icon.png?v=1" type="image/png" /></Head>
      {isPlaying ? (
        <div className="arena-viewport" ref={viewRef}>
          <div style={{ position: 'absolute', top: '15px', left: '20px', fontFamily: 'sans-serif', fontSize: '0.9rem', opacity: 0.7, zIndex: 10, textAlign: 'left', lineHeight: '1.4' }}>
            <strong>PREHISTOOIO ARENA v1.0</strong><br />
            <span style={{ fontSize: '1.2rem', color: '#00FF1A', fontWeight: 'bold' }}>SCORE: {score}</span><br />
            <span style={{ fontSize: '0.85rem', color: '#FFD700', textTransform: 'uppercase' }}>SPECIES: {evoTiers[activeTierIndex].name}</span><br />
            Coordinates: X: {Math.round(playerPosition.x)} Y: {Math.round(playerPosition.y)}
          </div>
          <button className="leave-btn" style={{ top: 'auto', bottom: '185px', right: '15px' }} onClick={() => { setIsPlaying(false); setScore(0); setActiveTierIndex(0); setPendingEvolutionIndex(null); }}>Leave Map</button>

          {/* DYNAMIC CLICKABLE ANIMAL-EVO HUD OVERLAY PANEL LAYER */}
          {pendingEvolutionIndex !== null && (
            <div className="evolution-prompt-clickable-hud-box" onClick={() => {
              setActiveTierIndex(pendingEvolutionIndex)
              setPendingEvolutionIndex(null)
              setChatMessages(p => [...p, { user: "System", text: `🧬 Transformed successfully into ${evoTiers[pendingEvolutionIndex].name}! Hitbox expanded.` }])
            }}>
              <img src="/animal-evo.png" alt="Evolve Background Frame" className="leaderboard-template-asset-graphic" />
              <img src={evoTiers[pendingEvolutionIndex].file} alt="Evo Target Preview" className="evolution-preview-avatar-inside-hud" />
              <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'sans-serif', fontSize: '0.55rem', fontWeight: 'bold', color: '#00FF1A', whiteSpace: 'nowrap' }}>CLICK TO EVOLVE</span>
            </div>
          )}

          <div className="hud-leaderboard-frame-container">
            <div style={{ position: 'relative', width: '100%' }}>
              <img src="/game-board.png" alt="Leaderboard Layout Asset" className="leaderboard-template-asset-graphic" onError={(e) => { e.target.src = "/leaderboard.png" }} />
              <div className="leaderboard-absolute-text-overlay-layer">
                {leaderboard.map((p, r) => (
                  
                    <span>{(r + 1) + ". " + p.name}</span><span>{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chat-container-hud" onClick={(e) => e.stopPropagation()}>
            <div className="chat-scroll-view">
              {chatMessages.map((m, i) => <div key={i} className="chat-msg-row"><strong style={{ color: m.user === "System" ? "#00FF1A" : "#FFD700" }}>{m.user}:</strong> {m.text}</div>)}
            </div>
            <form onSubmit={handleSendChat}><input type="text" className="chat-input-bar-inner" placeholder="Press Enter to type chat..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} maxLength={45} /></form>
          </div>
          
          <div className="infinite-ocean-world" style={{ transform: `translate(${400 - playerPosition.x}px, ${300 - playerPosition.y}px)` }}>
            <div className="gravel-seafloor-bed" />
            {propsList.kelp.map((k, i) => <img key={`k_${i}`} src="/kelp.png" alt="Kelp Stalk" className="scrolling-kelp-prop" style={{ top: k.y, left: k.x, height: k.h }} onError={(e) => { e.target.style.display = 'none' }} />)}
            {propsList.volcano && <img src="/volcano.png" alt="Volcano Vent Asset" className="scrolling-volcano-prop" style={{ top: propsList.volcano.y, left: propsList.volcano.x, width: propsList.volcano.w }} onError={(e) => { e.target.style.display = 'none' }} />}
            {propsList.bigRock && <img src="/big-rock.png" alt="Rock Prop Monument" className="scrolling-rock-prop" style={{ top: propsList.bigRock.y + 25, left: propsList.bigRock.x, width: propsList.bigRock.w }} onError={(e) => { e.target.style.display = 'none' }} />}
            {foodPellets.map((p) => !p.isEaten && <img key={p.id} src={p.src} alt="Plankton" className="custom-food-sprite-pellet" style={{ top: p.y, left: p.x }} onError={(e) => { e.target.src = "/food.png" }} />)}

            {/* BACK TO TRANSPARENT AND ADJUSTED DYNAMIC HITBOX SPECIES VIEWER */}
            <div style={{ position: 'absolute', top: playerPosition.y, left: playerPosition.x, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: evoTiers[activeTierIndex].scale + 'px', pointerEvents: 'none', backgroundColor: 'transparent', background: 'transparent' }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'sans-serif', marginBottom: '8px', border: '1px solid #00FF1A', whiteSpace: 'nowrap' }}>{username || "Guest"}</span>
              <div style={{ width: '100%', transform: `rotate(${playerRotation}deg)`, transition: 'transform 0.04s linear', backgroundColor: 'transparent', background: 'transparent' }}>
                <img 
                  src={(username || "").toUpperCase().replace(/\s/g, "").includes("(GHOUL)") ? "/ghoul.png" : evoTiers[activeTierIndex].file} 
                  alt="Prehistoric Species Avatar" 
                  className="player-fish-sprite" 
                  onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} 
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <img src="/leaderboard.png" alt="Leaderboard Frame Asset" style={{ position: 'fixed', left: '25px', top: '50%', transform: 'translateY(-50%)', width: '240px', zIndex: 100 }} />
          <img src="/wiki-button.png" alt="Wiki Menu Trigger" className="wiki-img" onClick={() => setIsWikiOpen(true)} />
          <div onClick={() => setIsWikiOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: isWikiOpen ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 105 }}>
            <div className="wiki-panel" onClick={(e) => e.stopPropagation()}><button className="close-btn" onClick={() => setIsWikiOpen(false)}>Close X</button><h2 className="ocean-title" style={{ fontSize: '2.2rem', textAlign: 'left', margin: '0' }}>Animal Wiki</h2><div className="grid-container"><img src="/AnimalGrid.png" alt="Wiki Inventory Matrix Grid" className="grid-img" />{slotPositions.map((p, i) => <div key={i} className="slot-over" style={{ top: p.t, left: p.l, width: "10.5%", height: "28%" }} onMouseEnter={() => setHoveredAnimal(slots[i])} onMouseLeave={() => setHoveredAnimal("")} />)}</div><div className="hud-banner"><p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: hoveredAnimal ? '#00FF1A' : '#fff' }}>{hoveredAnimal || "Hover over a creature to analyze metadata"}</p></div></div></div>
          <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="ocean-title" style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Prehistooio</h1>
            <p className="ocean-sub" style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '1.5rem' }}>Made by Polentacze - Inspired by Deeeepio</p>
            <img src="/prehistoric-skeleton.png" alt="Main Prehistoric Logo Skeleton" style={{ width: '160px', marginBottom: '1.5rem', borderRadius: '12px' }} onError={(e) => { e.target.src = "/deep-prehistoo.png" }} />
            <p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', marginBottom: '0.5rem' }}>Fight your Prehistoric foes</p>
            <form className="launch-form" onSubmit={(e) => { e.preventDefault(); setIsPlaying(true); }}><div className="input-wrap"><img src="/input-box.png" alt="Custom User Input Text Border" style={{ width: '100%' }} /><input type="text" className="field-text" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={14} placeholder="Enter Name..." style={{ color: '#333' }} /></div><button type="submit" className="play-btn"><img src="/play-button.png" alt="Launch Server Connection" style={{ width: '100%' }} /></button></form>
          </main>
        </>
      )}
    </div>
  )
}
  
