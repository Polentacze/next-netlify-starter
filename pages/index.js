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

  // EVOLUTION HUD PANEL INTERFACE STATES
  const [scoreAtLastEvolve, setScoreAtLastEvolve] = useState(0)
  const [showEvoWindow, setShowEvoWindow] = useState(false)
  const [currentTierIndex, setCurrentTierIndex] = useState(0)

  // EXACT REPOSITORY GAME SPRITE FILENAME DEFINITIONS
  const tiersList = [
    { name: "Sacabambaspis", sprite: "/sacabambaspis.png", size: 90 },
    { name: "Stethacanthus altonensis", sprite: "/Stethacanthus-altonensis.png", size: 100 },
    { name: "Squalicorax Pristodontus", sprite: "/Squalicorax-Pristodontus.png", size: 110 },
    { name: "Xiphiorhynchus kimblalocki", sprite: "/Xiphiorhynchus-kimblalocki.png", size: 120 },
    { name: "Liopleurodon Ferox", sprite: "/Liopleurodon-Ferox.png", size: 135 },
    { name: "Otodus Megalodon", sprite: "/Otodus-Megalodon.png", size: 160 }
  ]

  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Prehistooio Arena loaded. Eat 45 pellets to open your Evolution window!" }
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

  // DYNAMIC LEVEL MILESTONE RADAR WATCHER
  useEffect(() => {
    if (!isPlaying) return
    
    // Calculates if score earned since the last evolution hits your new 4,500 point cap
    const earnedXP = score - scoreAtLastEvolve
    const nextTierAvailable = currentTierIndex + 1 < tiersList.length

    if (earnedXP >= 4500 && nextTierAvailable && !showEvoWindow) {
      setShowEvoWindow(true) // Triggers your evolution pop-up window!
    }
  }, [score, scoreAtLastEvolve, currentTierIndex, isPlaying, showEvoWindow])

  // INITIAL WORLD CONTEXT MAP SCENERY LAYOUT GENERATOR
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
        { x: 600, y: 1755, h: 180 },
        { x: 1200, y: 1755, h: 210 },
        { x: 1800, y: 1755, h: 170 },
        { x: 2400, y: 1755, h: 230 }
      ],
      volcano: { x: 900, y: 1765, w: 110 },
      bigRock: { x: 2100, y: 1755, w: 160 }
    })
  }, [isPlaying])
    // LIVE COMPETITOR HUD OVERLAY DATA POPULATION SCRIPT
  useEffect(() => {
    if (!isPlaying) return

    let simulatedBots = [
      { name: "Apex_Megalodon", score: 22000 },
      { name: "TrenchHunter", score: 14000 },
      { name: "Helico_Bite", score: 9500 },
      { name: "Liopleurodon", score: 6800 },
      { name: "Shasta_Surfer", score: 4400 },
      { name: "Pliosaurus_Rex", score: 3200 },
      { name: "SwordFish_X", score: 1600 },
      { name: "Stetha_Fin", score: 800 },
      { name: "Squalicorax", score: 300 }
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
