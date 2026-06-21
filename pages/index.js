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
  const [isAbilityActive, setIsAbilityActive] = useState(false)
  const [abilityBoostsUsed, setAbilityBoostsUsed] = useState(0)
  const [clamMeats, setClamMeats] = useState([])
  const [isClanOpen, setIsClanOpen] = useState(false) 
  
  // 💾 LOCALSTORAGE BLUEPRINT: Automatically fetches their permanently saved clan name on load!
  const [activeClan, setActiveClan] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('prehistooio_clan') || ""
    }
    return ""
  })      
  
  const [clanInputTemp, setClanInputTemp] = useState("") 
  const evoTiers = [ 
    { name: "Sacabambaspis", minScore: 0, scale: 80, file: "/sacabambaspis.png" }, 
    { name: "Stethacanthus altonensis", minScore: 4500, scale: 115, file: "/Stethacanthus-altonensis.png" },
    { name: "Dunkleosteus", minScore: 9500, scale: 150, file: "/dunkleosteus.png" } // 🧬 Balanced Tier 3 landmark addition
  ] 
  const [activeTierIndex, setActiveTierIndex] = useState(0)
  const [pendingEvolutionIndex, setPendingEvolutionIndex] = useState(null)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Prehistooio loaded! Press E with 2 boosts for your aligned surge!", colorCode: "#00FF1A" }
  ])
  const slots = ["Megalodon", "Shastasaurus", "Pliosaurus", "Helicoprion", "Xiphiorhynchus", "Liopleurodon", "Stethacanthus", "Squalicorax"]
  const slotPositions = [{ t: "16%", l: "13.5%" }, { t: "16%", l: "24.7%" }, { t: "16%", l: "35.9%" }, { t: "16%", l: "47.1%" }, { t: "16%", l: "58.3%" }, { t: "16%", l: "69.5%" }, { t: "48%", l: "13.5%" }, { t: "48%", l: "24.7%" }]

  const detectTextColor = (targetString) => { 
    const cleanStr = (targetString || "").toUpperCase() 
    
    // 👑 STATE-VERIFIED CLAN CHECK: Only triggers gold if a crew is registered and matches exactly!
    if (activeClan) {
      const matchTag = `[${activeClan.toUpperCase()}]`
      if (cleanStr.includes(matchTag)) {
        return "#FFD700" // 🌟 Approved Golden Yellow
      }
    }

    // Standard cosmetic modifiers fallback
    if (cleanStr.includes("(RED)")) return "#ff4d4d" 
    if (cleanStr.includes("(BLUE)")) return "#3b82f6" 
    if (cleanStr.includes("(GREEN)")) return "#00FF1A" 
    if (cleanStr.includes("(CYAN)")) return "#00ffff" 
    if (cleanStr.includes("(PURPLE)")) return "#a855f7" 
    if (cleanStr.includes("(GREY)") || cleanStr.includes("(GRAY)")) return "#9ca3af" 
    return "#FFFFFF" 
  } 
  // 🧼 CHAT & NAME TEXT REPLACEMENT LOOP: Keeps text clean and safe
  const cleanTags = (str) => {
    if (!str) return ""
    let result = str
    const targets = ["(RED)", "(BLUE)", "(GREEN)", "(CYAN)", "(PURPLE)", "(GREY)", "(GRAY)"]
    for (let i = 0; i < targets.length; i++) {
      let upper = result.toUpperCase()
      let idx = upper.indexOf(targets[i])
      while (idx !== -1) {
        result = result.substring(0, idx) + result.substring(idx + targets[i].length)
        upper = result.toUpperCase()
        idx = upper.indexOf(targets[i])
      }
    }
    return result.trim()
  }

  const handleSendChat = (e) => { 
    e.preventDefault() 
    if (!chatInput.trim()) return 
    
    // 🏷️ Dynamically matches colors to whoever sent it
    let messageColor = detectTextColor(chatInput) 
    if (messageColor === "#FFFFFF") messageColor = detectTextColor(username) 
    
    const cleanMessage = cleanTags(chatInput)
    if (!cleanMessage) return

    setChatMessages((p) => [...p, { 
      user: username || "Guest", 
      text: cleanMessage, 
      colorCode: messageColor 
    }]) 
    setChatInput("") 
  } 

  const getRandomCoord = () => ({ x: Math.floor(Math.random() * 2800) + 100, y: Math.floor(Math.random() * 1650) + 100 })

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
      kelp: [
        { x: 600, y: 1740, h: 230, type: 'kelp' },        
        { x: 1200, y: 1740, h: 85, type: 'coral' },       
        { x: 1800, y: 1740, h: 85, type: 'coral' },       
        { x: 2400, y: 1740, h: 230, type: 'kelp' }        
      ], 
      volcano: { x: 900, y: 1765, w: 110 }, 
      bigRock: { x: 2100, y: 1755, w: 160 },
      bigClam: { x: 1500, y: 1740, w: 170 }
    }) 
  }, [isPlaying]) 

  // 🧬 BULLETPROOF EVOLUTION ENGINE: Now featuring Secret Tier Interceptors for the Ghoul!
  useEffect(() => { 
    if (!isPlaying) return 
    
    // 🧟 UNDEAD ISOLATION GATING: If the player is a secret Ghoul, hard-lock their growth forever!
    const isSecretGhoul = (username || "").toUpperCase().replace(/\s/g, "").includes("(GHOUL)");
    if (isSecretGhoul) {
      if (pendingEvolutionIndex !== null) setPendingEvolutionIndex(null); // Instantly clears out any accidental alerts
      return; // 🛑 Force exits the hook early so no evolutionary level-ups can ever process
    }

    // Standard progression checkpoints for normal fish tiers
    if (activeTierIndex === 0 && score >= 4500) { 
      if (pendingEvolutionIndex !== 1) setPendingEvolutionIndex(1) 
    } else if (activeTierIndex === 1 && score >= 9500) { 
      if (pendingEvolutionIndex !== 2) setPendingEvolutionIndex(2) 
    } 
  }, [score, activeTierIndex, isPlaying, username, pendingEvolutionIndex]) // 🌟 Added username monitoring to track the secret name check!

  // 🦪 AUTOMATED CLAM MEAT DISPENSER: Ticks every 4 seconds to spawn up to 5 max items inside the clam shell
  useEffect(() => {
    if (!isPlaying) {
      setClamMeats([])
      return
    }
    const meatTimer = setInterval(() => {
      setClamMeats((currentMeats) => {
        const activeCount = currentMeats.filter(m => !m.isEaten).length
        if (activeCount >= 5) return currentMeats 

        const clamCenterX = 1500
        const clamBaseY = 1740
        const randomXOffset = Math.floor(Math.random() * 80) - 40     
        const randomYOffset = -(Math.floor(Math.random() * 45) + 15)  

        const newMeat = {
          id: "meat_" + Date.now(),
          x: clamCenterX + randomXOffset,
          y: clamBaseY + randomYOffset,
          isEaten: false
        }
        return [...currentMeats, newMeat]
      })
    }, 4000)
    return () => clearInterval(meatTimer)
  }, [isPlaying])

// ⏱️ PRIMARY GAME ENGINE LOOP EFFECT HOOK
useEffect(() => { 
    if (!isPlaying) return 
    
    // 🍉 Initial Food Generation Batch
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
      kelp: [
        { x: 600, y: 1740, h: 230, type: 'kelp' },        
        { x: 1200, y: 1740, h: 85, type: 'coral' },       
        { x: 1800, y: 1740, h: 85, type: 'coral' },       
        { x: 2400, y: 1740, h: 230, type: 'kelp' }        
      ], 
      volcano: { x: 900, y: 1765, w: 110 }, 
      bigRock: { x: 2100, y: 1755, w: 160 },
      bigClam: { x: 1500, y: 1740, w: 170 }
    }) 

    // 🔄 Continuous Food Replenishment Loop (Checks and tops up food every 3 seconds)
    const foodReplenishTimer = setInterval(() => {
      setFoodPellets((currentPellets) => {
        const activeCount = currentPellets.filter(p => !p.isEaten).length
        // If the map has dropped below 30 pellets, spawn a fresh batch automatically
        if (activeCount < 30) {
          const spawnGroupX = Math.floor(Math.random() * 2600) + 200
          const spawnGroupY = Math.floor(Math.random() * 1400) + 200
          const freshPellets = []
          
          for (let i = 0; i < 5; i++) {
            const isOceanFood = Math.random() > 0.6
            freshPellets.push({
              id: "replenish_" + Date.now() + "_" + i,
              x: spawnGroupX + (Math.random() * 100 - 50),
              y: spawnGroupY + (Math.random() * 100 - 50),
              isEaten: false,
              value: isOceanFood ? 120 : 100,
              src: isOceanFood ? "/ocean-food.png" : "/food.png"
            })
          }
          return [...currentPellets, ...freshPellets]
        }
        return currentPellets
      })
    }, 3000)

    return () => clearInterval(foodReplenishTimer)
  }, [isPlaying])
    const mm = (e) => { 
      if (!viewRef.current) return 
      const rect = viewRef.current.getBoundingClientRect() 
      mousePos.current = { x: e.clientX - rect.left - (rect.width / 2), y: e.clientY - rect.top - (rect.height / 2) } 
    } 

    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT") return

      if (e.key.toLowerCase() === 'e') {
        // 🦕 TIER 1 (Stethacanthus Speed Surge)
        if (activeTierIndex === 1) {
          if (boostBars < 1 || isAbilityActive) return
          setIsAbilityActive(true)
          setBoostBars((prev) => Math.max(0, prev - 1))
          setTimeout(() => { setIsAbilityActive(false) }, 5000)
          return
        }

        // 🦈 TIER 2
        if (activeTierIndex === 2) {
          if (boostBars < 1 || isAbilityActive) return
          setIsAbilityActive(true)
          setBoostBars((prev) => Math.max(0, prev - 1))
          setTimeout(() => { setIsAbilityActive(false) }, 5000)
          return
        }

        // 🛡️ TIER 3 (Dunkleosteus Armored Guard)
        if (activeTierIndex === 3) {
          if (boostBars < 1 || isAbilityActive) return
          setIsAbilityActive(true)
          setBoostBars((prev) => Math.max(0, prev - 1))
          setTimeout(() => { setIsAbilityActive(false) }, 6000) // ⏱️ Lasts exactly 6 seconds
          return
        }
      }
    }

    const tick = setInterval(() => {
      let cx = playerPosition.x, cy = playerPosition.y
      
      setPlayerPosition((p) => {
        const rad = Math.atan2(mousePos.current.y, mousePos.current.x)
        const dist = Math.sqrt(mousePos.current.x ** 2 + mousePos.current.y ** 2)
        
        // Dunkleosteus (Tier 3) stays at normal speed during active ability
        let maxSpeed = 4.8
        if (isAbilityActive && activeTierIndex !== 3) maxSpeed = 9.6 
        
        let spd = dist > 25 ? Math.min(dist * 0.035, maxSpeed) : 0

        if (isBoosting) {
          if (activeTierIndex === 3) {
            spd = 18
          } else {
            spd = isAbilityActive ? 24 : 18
          }
        }

        const dx = Math.cos(rad) * spd, dy = Math.sin(rad) * spd
        if (spd > 0) setPlayerRotation(rad * (180 / Math.PI) + 90)
        
        cx = Math.max(50, Math.min(2950, p.x + dx))
        cy = Math.max(50, Math.min(1725, p.y + dy))
        
        return { x: cx, y: cy }
      })

      // 🟢 FIX 1: Correctly updates pellet eating logic so old items vanish and spawn loops continue
      setFoodPellets((prev) => prev.map((f) => {
        if (f.isEaten) return f
        if (Math.sqrt((cx - f.x) ** 2 + (cy - f.y) ** 2) < 30) {
          setScore((s) => s + f.value) // Normal = 100, Ocean = 120
          setFoodEatenCount((pr) => {
            const nxt = pr + 1
            if (nxt >= 5) {
              setBoostBars((b) => Math.min(3, b + 1))
              return 0
            }
            return nxt
          })
          return { ...f, isEaten: true }
        }
        return f
      }))

      // 🟢 FIX 2: Monitors the standalone Clam Meat layer and rewards exactly 205 points!
      setClamMeats((prev) => prev.map((m) => {
        if (m.isEaten) return m
        if (Math.sqrt((cx - m.x) ** 2 + (cy - m.y) ** 2) < 35) {
          setScore((s) => s + 205) // Clam Meat original value
          setFoodEatenCount((pr) => {
            const nxt = pr + 1
            if (nxt >= 5) {
              setBoostBars((b) => Math.min(3, b + 1))
              return 0
            }
            return nxt
          })
          return { ...m, isEaten: true }
        }
        return m
      }))

    }, 1000 / 60)

    window.addEventListener('mousemove', mm)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('keydown', handleKeyDown)
      clearInterval(tick)
    }
  }, [isPlaying, playerPosition, isBoosting, isAbilityActive, activeTierIndex, boostBars])

  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#104E8B', position: 'relative', overflowX: 'hidden', userSelect: 'none' }}>
      <Head><title>Prehistooio</title><link rel="icon" href="/icon.png?v=1" type="image/png" /></Head>
      <style dangerouslySetInnerHTML={{__html: `@import url('https://googleapis.com');.ocean-title{font-family:'Rye',serif!important}.ocean-sub{font-family:'Rye',serif!important}.wiki-img{position:fixed;right:0px;top:50%;transform:translateY(-50%);width:220px;cursor:pointer;z-index:100;filter:drop-shadow(-5px 5px 10px rgba(0,0,0,0.3))}.wiki-panel{width:850px;background-color:#3b5ca8;border:6px solid #2a437a;border-radius:28px;padding:2rem;position:relative}.close-btn{background-color:#ff4d4d;color:white;border:none;padding:0.5rem 1rem;border-radius:8px;font-weight:bold;cursor:pointer;position:absolute;top:1.5rem;right:1.5rem;z-index:120}.grid-container{position:relative;width:100%;margin-top:1.5rem}.grid-img{width:100%;display:block;border-radius:16px}.slot-over{position:absolute;cursor:pointer;border-radius:14px;transition:all 0.15s;border:3px solid transparent!important;background-color:transparent!important;background:transparent!important}.slot-over:hover{border-color:#00FF1A!important;background:rgba(0,255,26,0.08)!important;box-shadow:0 0 15px #00FF1A}.hud-banner{margin-top:1.5rem;background:#2a437a;padding:1rem;border-radius:16px;min-height:60px;display:flex;justify-content:center;align-items:center;border:3px solid rgba(255,255,255,0.15)}.launch-form{display:flex;flex-direction:column;align-items:center;gap:1.2rem;margin-top:1rem;z-index:50}.input-wrap{position:relative;width:320px}.play-btn{background:none;border:none;cursor:pointer;width:180px;filter:drop-shadow(0 5px 10px rgba(0,0,0,0.3))}.field-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;background:transparent;border:none;outline:none;color:#333333;font-size:1.1rem;text-align:center;font-weight:bold}.arena-viewport{width:800px;height:600px;background:#0b355e;border:8px solid #2a437a;border-radius:24px;position:relative;overflow:hidden;cursor:crosshair;box-shadow:0 20px 40px rgba(0,0,0,0.5)}.infinite-ocean-world{position:absolute;width:3000px;height:2000px;background-color:#0b355e;background-image:linear-gradient(rgba(255, 255, 255, 0.04) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 2px, transparent 2px);background-size:100px 100px;transition:transform 0.1s ease-out}.leave-btn{position:absolute;top:15px;background:#ff4d4d;border:2px solid white;color:white;padding:0.5rem 1rem;font-weight:bold;border-radius:8px;cursor:pointer;z-index:200}.player-fish-sprite{width:100%!important;height:auto!important;display:block!important;background:transparent!important;background-color:transparent!important;mix-blend-mode:normal!important}.custom-food-sprite-pellet{position:absolute;width:20px;height:auto;transform:translate(-50%,-50%);background:transparent!important}.chat-container-hud{position:absolute;bottom:15px;left:15px;width:250px;height:160px;background:rgba(42, 67, 122, 0.85);border:3px solid #2a437a;border-radius:12px;display:flex;flex-direction:column;padding:8px;z-index:150;box-shadow:0 4px 15px rgba(0,0,0,0.3)}.chat-scroll-view{flex-grow:1;overflow-y:auto;text-align:left;font-family:sans-serif;font-size:0.8rem;margin-bottom:6px;padding-right:4px}.chat-msg-row{margin-bottom:4px;line-height:1.3;word-break:break-word}.chat-input-bar-inner{width:100%;background-color:#104E8B;border:1px solid rgba(255,255,255,0.3);border-radius:6px;padding:4px 8px;color:white;font-size:0.8rem;outline:none}.chat-input-bar-inner:focus{border-color:#00FF1A}.gravel-seafloor-bed{position:absolute;bottom:0px;left:0px;width:3000px;height:260px;background-color:#5C4033;border-top:8px solid #3d2b22;box-shadow:inset 0 10px 20px rgba(0,0,0,0.4);z-index:30}.scrolling-kelp-prop{position:absolute;transform:translate(-50%,-100%);transform-origin:bottom center;width:38px;z-index:25;pointer-events:none;background:transparent!important}.scrolling-volcano-prop{position:absolute;transform:translate(-50%,-100%);z-index:28;pointer-events:none;background:transparent!important}.scrolling-rock-prop{position:absolute;transform:translate(-50%,-100%);z-index:27;pointer-events:none;background:transparent!important}.hud-boost-ammunition-deck{position:absolute;top:85px;right:20px;display:flex;flex-direction:column-reverse;gap:6px;width:18px;height:auto;background:rgba(0,0,0,0.4);padding:6px 4px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);z-index:190}.individual-energy-slice{width:100%;height:32px;border-radius:3px;border:1px solid rgba(0,0,0,0.6);transition:background-color 0.15s ease-out,box-shadow 0.15s}@keyframes ambientFloatOne{0%{transform:translateY(110vh) translateX(0px) rotate(0deg);opacity:0}10%{opacity:0.4}90%{opacity:0.4}100%{transform:translateY(-20vh) translateX(70px) rotate(360deg);opacity:0}}@keyframes ambientFloatTwo{0%{transform:translateY(110vh) translateX(0px) rotate(0deg);opacity:0}15%{opacity:0.3}85%{opacity:0.3}100%{transform:translateY(-20vh) translateX(-50px) rotate(-180deg);opacity:0}}.lobby-critter-one{position:fixed;left:12%;width:55px;height:auto;pointer-events:none;z-index:5;animation:ambientFloatOne 16s linear infinite}.lobby-critter-two{position:fixed;right:15%;width:45px;height:auto;pointer-events:none;z-index:5;animation:ambientFloatTwo 22s linear infinite}.evolution-prompt-clickable-hud-box{position:absolute;top:15px;left:50%;transform:translateX(-50%);width:140px;height:110px;z-index:180;cursor:pointer;pointer-events:auto;transition:transform 0.15s ease-out}.evolution-prompt-clickable-hud-box:hover{transform:translateX(-50%) scale(1.05);filter:drop-shadow(0 0 10px #00FF1A)}.evolution-preview-avatar-inside-hud{position:absolute;top:48%;left:50%;transform:translate(-50%,-50%);width:48px;height:auto;z-index:185;pointer-events:none}`}} />
      {isPlaying ? (
        <div 
          className="arena-viewport" 
          ref={viewRef} 
          onClick={() => {
            if (boostBars < 1 || isBoosting) return
            setIsBoosting(true)
            setBoostBars((b) => Math.max(0, b - 1))
            setTimeout(() => { setIsBoosting(false) }, 320)
          }}
        >
          <div style={{ position: 'absolute', top: '15px', left: '20px', fontFamily: 'sans-serif', fontSize: '0.9rem', opacity: 0.7, zIndex: 10, textAlign: 'left', lineHeight: '1.4' }}>
            <strong>PREHISTOOIO ARENA v1.0</strong><br />
            <span style={{ fontSize: '1.2rem', color: '#00FF1A', fontWeight: 'bold' }}>SCORE: {score}</span><br />
            <span style={{ fontSize: '0.85rem', color: '#FFD700', textTransform: 'uppercase' }}>SPECIES: {(username || "").toUpperCase().replace(/\s/g, "").includes("(GHOUL)") ? "UNKNOWN" : evoTiers[activeTierIndex].name}</span>
          </div>
          <button className="leave-btn" style={{ right: '20px' }} onClick={() => { setIsPlaying(false); setScore(0); setActiveTierIndex(0); setPendingEvolutionIndex(null); setIsAbilityActive(false); }}>Leave Map</button>

          {pendingEvolutionIndex !== null && (
            <div className="evolution-prompt-clickable-hud-box" onClick={(e) => { e.stopPropagation(); setActiveTierIndex(pendingEvolutionIndex); setPendingEvolutionIndex(null); setChatMessages(p => [...p, { user: "System", text: `🧬 Transformed successfully into ${evoTiers[pendingEvolutionIndex].name}!`, colorCode: "#00FF1A" }]) }}>
              <img src="/animal-evo.png" style={{ width: '100%' }} alt="frame" />
              <img src={evoTiers[pendingEvolutionIndex].file} className="evolution-preview-avatar-inside-hud" onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} alt="avatar" />
              <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'sans-serif', fontSize: '0.55rem', fontWeight: 'bold', color: '#00FF1A', whiteSpace: 'nowrap' }}>CLICK TO EVOLVE</span>
            </div>
          )}

          <div className="hud-boost-ammunition-deck">
            <div className="individual-energy-slice" style={{ backgroundColor: boostBars >= 1 ? '#00FF1A' : 'rgba(255,255,255,0.12)', boxShadow: boostBars >= 1 ? '0 0 8px #00FF1A' : 'none' }} />
            <div className="individual-energy-slice" style={{ backgroundColor: boostBars >= 2 ? '#00FF1A' : 'rgba(255,255,255,0.12)', boxShadow: boostBars >= 2 ? '0 0 8px #00FF1A' : 'none' }} />
            <div className="individual-energy-slice" style={{ backgroundColor: boostBars >= 3 ? '#00FF1A' : 'rgba(255,255,255,0.12)', boxShadow: boostBars >= 3 ? '0 0 8px #00FF1A' : 'none' }} />
          </div>

          <div className="chat-container-hud" onClick={(e) => e.stopPropagation()}>
            <div className="chat-scroll-view">
              {chatMessages.map((m, i) => (
                <div key={i} className="chat-msg-row" style={{ color: m.colorCode || '#FFFFFF' }}>
                  <strong style={{ color: detectTextColor(m.user) !== '#FFFFFF' ? detectTextColor(m.user) : m.user === "System" ? "#00FF1A" : "#FFD700" }}>{m.user}:</strong>{" "}{m.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat}><input type="text" className="chat-input-bar-inner" placeholder="Press Enter to type chat..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} maxLength={45} /></form>
          </div>
          
          <div className="infinite-ocean-world" style={{ transform: 'translate(' + (400 - playerPosition.x) + 'px, ' + (300 - playerPosition.y) + 'px)' }}>
            <div className="gravel-seafloor-bed" />
            {propsList.kelp.map((k, idx) => {
              const anchorAdjustment = k.type === 'coral' ? 12 : 42;
              const finalTopY = k.y + anchorAdjustment;
              return (
                <img 
                  key={idx} 
                  src={k.type === 'coral' ? "/brain-coral.png" : "/kelp.png"} 
                  alt="prop" 
                  style={{ 
                    position: 'absolute', 
                    top: finalTopY, 
                    left: k.x, 
                    height: k.type === 'coral' ? 'auto' : k.h, 
                    width: k.type === 'coral' ? `${k.h}px` : '38px', 
                    transform: 'translate(-50%, -100%)',
                    zIndex: k.type === 'coral' ? 26 : 25,
                    pointerEvents: 'none',
                    background: 'transparent'
                  }} 
                  onError={(e) => { e.currentTarget.style.display = 'none' }} 
                />
              );
            })}

            {propsList.volcano && <img src="/volcano.png" alt="volcano" className="scrolling-volcano-prop" style={{ top: propsList.volcano.y, left: propsList.volcano.x, width: propsList.volcano.w }} onError={(e) => { e.target.style.display = 'none' }} />}
            {propsList.bigRock && <img src="/big-rock.png" alt="rock" className="scrolling-rock-prop" style={{ top: propsList.bigRock.y + 25, left: propsList.bigRock.x, width: propsList.bigRock.w }} onError={(e) => { e.target.style.display = 'none' }} />}
            {propsList.bigClam && <img src="/big-clam.png" alt="clam" style={{ position: 'absolute', top: propsList.bigClam.y + 12, left: propsList.bigClam.x, width: propsList.bigClam.w, transform: 'translate(-50%, -100%)', zIndex: 26, pointerEvents: 'none', background: 'transparent' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />}
            {foodPellets.map((p) => !p.isEaten && <img key={p.id} src={p.src || "/food.png"} alt="food" className="custom-food-sprite-pellet" style={{ top: p.y, left: p.x }} onError={(e) => { e.target.src = "/food.png" }} />)}
            
            {clamMeats.map((m) => !m.isEaten && (
              <img 
                key={m.id} 
                src="/meat.png" 
                alt="meat" 
                style={{ 
                  position: 'absolute', 
                  top: m.y, 
                  left: m.x, 
                  width: '28px', 
                  height: 'auto', 
                  transform: 'translate(-50%, -50%)', 
                  zIndex: 27, 
                  pointerEvents: 'none',
                  backgroundColor: 'transparent',
                  background: 'transparent',
                  display: 'block'
                }} 
                onError={(e) => { e.currentTarget.style.display = 'none' }} 
              />
            ))}

            <div style={{ position: 'absolute', top: playerPosition.y, left: playerPosition.x, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: evoTiers[activeTierIndex]?.scale + 'px', pointerEvents: 'none', background: 'transparent', backgroundColor: 'transparent' }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'sans-serif', marginBottom: '8px', border: '1px solid ' + (detectTextColor(username) !== '#FFFFFF' ? detectTextColor(username) : '#00FF1A'), color: detectTextColor(username), whiteSpace: 'nowrap' }}>{username || "Guest"}</span>
              <div style={{ width: '100%', position: 'relative', transform: 'rotate(' + playerRotation + 'deg)', transition: 'transform 0.04s linear', background: 'transparent', backgroundColor: 'transparent' }}>
<img src={username && username.toUpperCase().replace(/\s/g, "").includes("(GHOUL)") ? "/ghoul.png" : evoTiers[activeTierIndex]?.file} alt="fish" className="player-fish-sprite" onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} />

{/* 🦕 Stethacanthus Ability Layer (Index 1) */}
{isAbilityActive && activeTierIndex === 1 && (
  <img 
    src="/steth-ability.png" 
    alt="Speed Surge Active" 
    style={{ position: 'absolute', top: '-65px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: 'auto', background: 'transparent', pointerEvents: 'none' }} 
    onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} 
  />
)}

{/* 🛡️ Dunkleosteus Ability Layer (Index 2) */}
{isAbilityActive && activeTierIndex === 2 && (
  <img 
    src="/dunk-ability.png" 
    alt="Armored Guard Active" 
    style={{ position: 'absolute', top: '-65px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: 'auto', backgroundColor: 'transparent', background: 'transparent', pointerEvents: 'none' }} 
    onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} 
  />
)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <img src="/trilobite.png" className="lobby-critter-one" onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} alt="critter" />
          <img src="/ammonite.png" className="lobby-critter-two" onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} alt="critter" />
          <img src="/leaderboard.png" alt="Leaderboard" style={{ position: 'fixed', left: '25px', top: '50%', transform: 'translateY(-50%)', width: '240px', zIndex: 100 }} />
          <img 
            src="/clan-button.png" 
            alt="Clan Button" 
            style={{ position: 'fixed', left: '25px', top: '22%', width: '240px', cursor: 'pointer', zIndex: 100 }} 
            onClick={() => setIsClanOpen(true)} 
          />
          <img src="/wiki-button.png" alt="Wiki" className="wiki-img" onClick={() => setIsWikiOpen(true)} />

          <div onClick={() => setIsWikiOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: isWikiOpen ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 105 }}>
            <div className="wiki-panel" onClick={(e) => e.stopPropagation()}><button className="close-btn" onClick={() => setIsWikiOpen(false)}>Close X</button><h2 className="ocean-title" style={{ fontSize: '2.2rem', textAlign: 'left', margin: '0' }}>Animal Wiki</h2><div className="grid-container"><img src="/AnimalGrid.png" alt="Grid" className="grid-img" />{slots.map((s, i) => <div key={i} className="slot-over" style={{ top: slotPositions[i].t, left: slotPositions[i].l, width: "10.5%", height: "28%" }} onMouseEnter={() => setHoveredAnimal(slots[i])} onMouseLeave={() => setHoveredAnimal("")} />)}</div><div className="hud-banner"><p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: hoveredAnimal ? '#00FF1A' : '#fff' }}>{hoveredAnimal || "Hover over a creature to analyze metadata"}</p></div></div>
          </div>
          
          <div onClick={() => setIsClanOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.65)', display: isClanOpen ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 110 }}> 
            <div className="wiki-panel" onClick={(e) => e.stopPropagation()} style={{ width: '650px', padding: '0', background: 'transparent', border: 'none' }}>
              <button className="close-btn" style={{ top: '1rem', right: '1rem' }} onClick={() => setIsClanOpen(false)}>Close X</button>
              <div style={{ position: 'relative', width: '100%' }}>
                <img src="/clan-selection.png" alt="Clan Selection Panel" style={{ width: '100%', display: 'block', borderRadius: '24px' }} />
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!clanInputTemp.trim() || activeClan) return;
                  const savedName = clanInputTemp.trim().toUpperCase();
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('prehistooio_clan', savedName);
                  }
                  setActiveClan(savedName);
                  setIsClanOpen(false);
                }} style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '70%' }}>
                  <input 
                    type="text" 
                    className="field-text" 
                    value={activeClan ? activeClan : clanInputTemp} 
                    onChange={(e) => setClanInputTemp(e.target.value)} 
                    maxLength={10} 
                    disabled={activeClan !== ""} 
                    placeholder={activeClan ? `Active Clan: ${activeClan}` : "Type clan name..."} 
                    style={{ position: 'static', transform: 'none', width: '85%', background: '#fff', border: '3px solid #2a437a', borderRadius: '12px', padding: '10px', fontSize: '1.2rem', textAlign: 'center', fontWeight: 'bold', color: '#333' }} 
                  />
                  <button type="submit" disabled={activeClan !== ""} style={{ background: 'none', border: 'none', cursor: activeClan ? 'not-allowed' : 'pointer', width: '130px', height: '45px' }}>
                    <div style={{ display: 'none' }}>Form</div>
                  </button>
                </form>
              </div>
            </div> 
          </div>

          <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <h1 className="ocean-title" style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Prehistooio</h1>
            <p className="ocean-sub" style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '1.5rem' }}>Made by Polentacze - Inspired by Deeeepio</p>
            <img src="/prehistoric-skeleton.png" alt="Skeleton" style={{ width: '160px', marginBottom: '1.5rem', borderRadius: '12px' }} onError={(e) => { e.target.src = "/deep-prehistoo.png" }} />
            <p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', marginBottom: '0.5rem' }}>Fight your Prehistoric foes</p>
            <form className="launch-form" onSubmit={(e) => { e.preventDefault(); setIsPlaying(true); }}>
              <div className="input-wrap">
                <img src="/input-box.png" alt="Input field" style={{ width: '100%' }} />
                <input type="text" className="field-text" placeholder="Enter Username..." value={username} onChange={(e) => setUsername(e.target.value)} maxLength={15} required />
              </div>
              <button type="submit" className="play-btn">
                <img src="/play-button.png" alt="Play Button" style={{ width: '100%' }} />
              </button>
            </form>
          </main>
        </>
      )}
    </div>
  )
}
