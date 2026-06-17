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
    // 🚀 AMMUNITION & SKILL LIMIT TRACKERS
  const [boostBars, setBoostBars] = useState(3) 
  const [foodEatenCount, setFoodEatenCount] = useState(0) 
  const [isBoosting, setIsBoosting] = useState(false)
  const [isAbilityActive, setIsAbilityActive] = useState(false)
  const [abilityBoostsUsed, setAbilityBoostsUsed] = useState(0) // Tracks the strict 2-use limit rule

  // 🧬 SPECIES EVOLUTION DATABASES (Tuned Stethacanthus scale parameters out to a prominent 115px)
  const evoTiers = [
    { name: "Sacabambaspis", minScore: 0, scale: 80, file: "/sacabambaspis.png" },
    { name: "Stethacanthus altonensis", minScore: 4500, scale: 115, file: "/Stethacanthus-altonensis.png" }
  ]
  const [activeTierIndex, setActiveTierIndex] = useState(0)
  const [pendingEvolutionIndex, setPendingEvolutionIndex] = useState(null)
    const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Prehistooio balanced! Press 'E' with 2 boosts to ignite your heading-aligned speed surge!", colorCode: "#00FF1A" }
  ])

  const slots = ["Megalodon", "Shastasaurus", "Pliosaurus", "Helicoprion", "Xiphiorhynchus", "Liopleurodon", "Stethacanthus", "Squalicorax"]
  const slotPositions = [{ t: "16%", l: "13.5%" }, { t: "16%", l: "24.7%" }, { t: "16%", l: "35.9%" }, { t: "16%", l: "47.1%" }, { t: "16%", l: "58.3%" }, { t: "16%", l: "69.5%" }, { t: "48%", l: "13.5%" }, { t: "48%", l: "24.7%" }]
                           const detectTextColor = (targetString) => {
    const cleanStr = (targetString || "").toUpperCase()
    if (cleanStr.includes("(RED)")) return "#ff4d4d"
    if (cleanStr.includes("(BLUE)")) return "#3b82f6"
    if (cleanStr.includes("(GREEN)")) return "#00FF1A"
    if (cleanStr.includes("(CYAN)")) return "#00ffff"
    return "#FFFFFF"
  }

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    let messageColor = detectTextColor(chatInput)
    if (messageColor === "#FFFFFF") messageColor = detectTextColor(username)
    setChatMessages((p) => [...p, { user: username || "Guest", text: chatInput, colorCode: messageColor }])
    setChatInput("")
  }
    const getRandomCoord = () => ({ x: Math.floor(Math.random() * 2800) + 100, y: Math.floor(Math.random() * 1650) + 100 })

  const handleViewportClick = () => {
    if (boostBars < 1 || isBoosting) return
    
    // STANDARD CLICK BOOST REFUSAL IF SURGE IS RUNNING
    if (isAbilityActive) return

    setIsBoosting(true)
    setBoostBars(0) // Wipeout mechanic drains bars to 0 on click
    
    // TRACKS STANDARD AMMUNITION USAGE BALANCING RULES DURING SURGE
    setAbilityBoostsUsed((prev) => {
      const nextCount = prev + 1
      if (nextCount >= 2) {
        setIsAbilityActive(false) // Hard-shuts off ability after exactly two boosts are consumed
        return 0
      }
      return nextCount
    })

    setTimeout(() => { setIsBoosting(false) }, 320)
  }
    useEffect(() => {
    if (!isPlaying) return
    const pellets = []
    for (let c = 0; c < 8; c++) {
      const cx = Math.floor(Math.random() * 2600) + 200, cy = Math.floor(Math.random() * 1400) + 200
      for (let i = 0; i < 6; i++) pellets.push({ id: "s_" + c + "_" + i, x: cx + (Math.random() * 120 - 60), y: cy + (Math.random() * 120 - 60), isEaten: false, value: 100, src: "/food.png" })
    }
    for (let c = 0; c < 4; c++) {
      const cx = Math.floor(Math.random() * 2600) + 200, cy = Math.floor(Math.random() * 1400) + 200
      for (let i = 0; i < 4; i++) pellets.push({ id: "p_" + c + "_" + i, x: cx + (Math.random() * 120 - 60), y: cy + (Math.random() * 120 - 60), isEaten: false, value: 120, src: "/ocean-food.png" })
    }
    setFoodPellets(pellets)
    setPropsList({
      kelp: [{ x: 600, y: 1755, h: 180 }, { x: 1200, y: 1755, h: 210 }, { x: 1800, y: 1755, h: 170 }, { x: 2400, y: 1755, h: 230 }],
      volcano: { x: 900, y: 1765, w: 110 }, bigRock: { x: 2100, y: 1755, w: 160 }
    })
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

    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT") return
      
      // KEYBOARD 'E' SIGNAL HOOK: Requires exactly 2 full boost bars to trigger
      if (e.key.toLowerCase() === 'e') {
        if (boostBars < 2 || isAbilityActive || activeTierIndex !== 1) return

        setIsAbilityActive(true)
        setAbilityBoostsUsed(0) // Resets tracking loops
        setChatMessages(p => [...p, { user: "System", text: "⚡ Special Ability Unleashed! Double boost velocity multiplier active.", colorCode: "#ff4d4d" }])
      }
    }

    const mm = (e) => {
      if (!viewRef.current) return
      const rect = viewRef.current.getBoundingClientRect()
      mousePos.current = { x: e.clientX - rect.left - (rect.width / 2), y: e.clientY - rect.top - (rect.height / 2) }
    }

    const tick = setInterval(() => {
      let cx = playerPosition.x, cy = playerPosition.y
      setPlayerPosition((p) => {
        const rad = Math.atan2(mousePos.current.y, mousePos.current.x), dist = Math.sqrt(mousePos.current.x ** 2 + mousePos.current.y ** 2)
        
        let maxSpeed = 4.8
        if (isAbilityActive) maxSpeed = 9.6 // Weighty base velocity ceiling doubled to 9.6 while active

        let spd = dist > 25 ? Math.min(dist * 0.035, maxSpeed) : 0
        if (isBoosting) spd = 18 

        const dx = Math.cos(rad) * spd, dy = Math.sin(rad) * spd
        if (spd > 0) setPlayerRotation(rad * (180 / Math.PI) + 90)
        cx = Math.max(50, Math.min(2950, p.x + dx)); cy = Math.max(50, Math.min(1725, p.y + dy))
        return { x: cx, y: cy }
      })
            setFoodPellets((prev) => prev.map((f) => {
        if (f.isEaten) return f
        if (Math.sqrt((cx - f.x) ** 2 + (cy - f.y) ** 2) < 30) {
          setScore((s) => s + f.value)
          
          setFoodEatenCount((pr) => {
            const nxt = pr + 1
            if (nxt >= 5) {
              // FORBIDS REFILL CONTINUATION DURING ACTIVE SURGE STATE
              if (!isAbilityActive) {
                setBoostBars((b) => Math.min(3, b + 1))
              }
              return 0
            }
            return nxt
          })

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
    window.addEventListener('keydown', handleKeyDown)
    return () => { 
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('keydown', handleKeyDown)
      clearInterval(tick) 
    }
  }, [isPlaying, playerPosition, isBoosting, isAbilityActive, boostBars])
    return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#104E8B', position: 'relative', overflowX: 'hidden', userSelect: 'none' }}>
      <Head><title>Prehistooio</title><link rel="icon" href="/icon.png?v=1" type="image/png" /></Head>
      <style dangerouslySetInnerHTML={{__html: `@import url('https://googleapis.com');.ocean-title{font-family:'Rye',serif!important}.ocean-sub{font-family:'Rye',serif!important}.wiki-img{position:fixed;right:0px;top:50%;transform:translateY(-50%);width:220px;cursor:pointer;z-index:100;filter:drop-shadow(-5px 5px 10px rgba(0,0,0,0.3))}.wiki-panel{width:850px;background-color:#3b5ca8;border:6px solid #2a437a;border-radius:28px;padding:2rem;position:relative}.close-btn{background-color:#ff4d4d;color:white;border:none;padding:0.5rem 1rem;border-radius:8px;font-weight:bold;cursor:pointer;position:absolute;top:1.5rem;right:1.5rem;z-index:120}.grid-container{position:relative;width:100%;margin-top:1.5rem}.grid-img{width:100%;display:block;border-radius:16px}.slot-over{position:absolute;cursor:pointer;border-radius:14px;transition:all 0.15s;border:3px solid transparent!important;background-color:transparent!important;background:transparent!important}.slot-over:hover{border-color:#00FF1A!important;background:rgba(0,255,26,0.08)!important;box-shadow:0 0 15px #00FF1A}.hud-banner{margin-top:1.5rem;background:#2a437a;padding:1rem;border-radius:16px;min-height:60px;display:flex;justify-content:center;align-items:center;border:3px solid rgba(255,255,255,0.15)}.launch-form{display:flex;flex-direction:column;align-items:center;gap:1.2rem;margin-top:1rem;z-index:50}.input-wrap{position:relative;width:320px}.play-btn{background:none;border:none;cursor:pointer;width:180px;filter:drop-shadow(0 5px 10px rgba(0,0,0,0.3))}.field-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;background:transparent;border:none;outline:none;color:#333333;font-size:1.1rem;text-align:center;font-weight:bold}.arena-viewport{width:800px;height:600px;background:#0b355e;border:8px solid #2a437a;border-radius:24px;position:relative;overflow:hidden;cursor:crosshair;box-shadow:0 20px 40px rgba(0,0,0,0.5)}.infinite-ocean-world{position:absolute;width:3000px;height:2000px;background-color:#0b355e;background-image:linear-gradient(rgba(255,255,255,0.04) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,0.04) 2px,transparent 2px);background-size:100px 100px;transition:transform 0.1s ease-out}.leave-btn{position:absolute;top:15px;background:#ff4d4d;border:2px solid white;color:white;padding:0.5rem 1rem;font-weight:bold;border-radius:8px;cursor:pointer;z-index:200}.player-fish-sprite{width:100%!important;height:auto!important;display:block!important;background:transparent!important;background-color:transparent!important;mix-blend-mode:normal!important}.custom-food-sprite-pellet{position:absolute;width:20px;height:auto;transform:translate(-50%,-50%);background:transparent!important}.chat-container-hud{position:absolute;bottom:15px;left:15px;width:250px;height:160px;background:rgba(42, 67, 122, 0.85);border:3px solid #2a437a;border-radius:12px;display:flex;flex-direction:column;padding:8px;z-index:150;box-shadow:0 4px 15px rgba(0,0,0,0.3)}.chat-scroll-view{flex-grow:1;overflow-y:auto;text-align:left;font-family:sans-serif;font-size:0.8rem;margin-bottom:6px;padding-right:4px}.chat-msg-row{margin-bottom:4px;line-height:1.3;word-break:break-word}.chat-input-bar-inner{width:100%;background-color:#104E8B;border:1px solid rgba(255,255,255,0.3);border-radius:6px;padding:4px 8px;color:white;font-size:0.8rem;outline:none}.chat-input-bar-inner:focus{border-color:#00FF1A}.gravel-seafloor-bed{position:absolute;bottom:0px;left:0px;width:3000px;height:260px;background-color:#5C4033;border-top:8px solid #3d2b22;box-shadow:inset 0 10px 20px rgba(0,0,0,0.4);z-index:30}.scrolling-kelp-prop{position:absolute;transform:translate(-50%,-100%);transform-origin:bottom center;width:38px;z-index:25;pointer-events:none;background:transparent!important}.scrolling-volcano-prop{position:absolute;transform:translate(-50%,-100%);z-index:28;pointer-events:none;background:transparent!important}.scrolling-rock-prop{position:absolute;transform:translate(-50%,-100%);z-index:27;pointer-events:none;background:transparent!important}.hud-boost-ammunition-deck{position:absolute;top:85px;right:20px;display:flex;flex-direction:column-reverse;gap:6px;width:18px;height:auto;background:rgba(0,0,0,0.4);padding:6px 4px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);z-index:190}.individual-energy-slice{width:100%;height:32px;border-radius:3px;border:1px solid rgba(0,0,0,0.6);transition:background-color 0.15s ease-out,box-shadow 0.15s}@keyframes ambientFloatOne{0%{transform:translateY(110vh) translateX(0px) rotate(0deg);opacity:0}10%{opacity:0.4}90%{opacity:0.4}100%{transform:translateY(-20vh) translateX(70px) rotate(360deg);opacity:0}}@keyframes ambientFloatTwo{0%{transform:translateY(110vh) translateX(0px) rotate(0deg);opacity:0}15%{opacity:0.3}85%{opacity:0.3}100%{transform:translateY(-20vh) translateX(-50px) rotate(-180deg);opacity:0}}.lobby-critter-one{position:fixed;left:12%;width:55px;height:auto;pointer-events:none;z-index:5;animation:ambientFloatOne 16s linear infinite}.lobby-critter-two{position:fixed;right:15%;width:45px;height:auto;pointer-events:none;z-index:5;animation:ambientFloatTwo 22s linear infinite}.evolution-prompt-clickable-hud-box{position:absolute;top:15px;left:50%;transform:translateX(-50%);width:140px;height:110px;z-index:180;cursor:pointer;pointer-events:auto;transition:transform 0.15s ease-out}.evolution-prompt-clickable-hud-box:hover{transform:translateX(-50%) scale(1.05);filter:drop-shadow(0 0 10px #00FF1A)}.evolution-preview-avatar-inside-hud{position:absolute;top:48%;left:50%;transform:translate(-50%,-50%);width:48px;height:auto;z-index:185;pointer-events:none}`}} />
