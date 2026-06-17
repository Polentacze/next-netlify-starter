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

  // 🐳 MULTI-TIER COHESIVE EVOLUTION STATE SYSTEM
  const [currentTierIndex, setCurrentTierIndex] = useState(0)
  const [evolutionPending, setEvolutionPending] = useState(false)

  const evolutionTree = [
    { name: "Sacabambaspis", scale: 90, sprite: "/sacabambaspis.png" },
    { name: "Stethacanthus", scale: 95, sprite: "/stethacanthus.png" },
    { name: "Squalicorax", scale: 105, sprite: "/squalicorax.png" },
    { name: "Xiphiorhynchus", scale: 115, sprite: "/xiphiorhynchus.png" },
    { name: "Liopleurodon", scale: 135, sprite: "/liopleurodon.png" }, // Bigger Hitbox
    { name: "Megalodon", scale: 165, sprite: "/megalodon.png" } // Maximum Hitbox (Not too big!)
  ]

  const [leaderboard, setLeaderboard] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Evolution Matrix v2.0 live. Reach 2,500 score multipliers to evolve species!" }
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

  // ⏰ 25-PELLET MULTIPLIER MILESTONE EVOLUTION TRACKER
  useEffect(() => {
    if (!isPlaying) return
    const nextTierTargetIndex = Math.min(Math.floor(score / 2500), evolutionTree.length - 1)
    
    // Trigger the selection prompt choice layer overlay if a brand new species index becomes unlocked
    if (nextTierTargetIndex > currentTierIndex) {
      setEvolutionPending(true)
    }
  }, [score, isPlaying, currentTierIndex])

  const acceptEvolutionChoice = () => {
    const nextIndex = Math.min(Math.floor(score / 2500), evolutionTree.length - 1)
    setCurrentTierIndex(nextIndex)
    setEvolutionPending(false)
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
      { name: "TrenchHunter", score: 11100 },
      { name: "Helico_Bite", score: 8500 },
      { name: "Liopleurodon", score: 6800 },
      { name: "Shasta_Surfer", score: 4400 },
      { name: "Pliosaurus_Rex", score: 2900 },
      { name: "SwordFish_X", score: 1600 },
      { name: "Stetha_Fin", score: 1100 },
      { name: "Squalicorax", score: 400 }
    ]

    const updateLeaderboard = () => {
      simulatedBots = simulatedBots.map(bot => ({
        ...bot,
        score: bot.score + (Math.random() > 0.6 ? 100 : 0)
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
      // Pause active character trajectory tracking physics calculations while selection modal is open
      if (evolutionPending) return;

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
  }, [isPlaying, playerPosition, playerRotation, evolutionPending])
   return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#104E8B', position: 'relative', overflowX: 'hidden', userSelect: 'none' }}>
      <Head>
        <title>Prehistooio</title>
        <link rel="icon" href="/icon.png?v=1" type="image/png" />
      </Head>
