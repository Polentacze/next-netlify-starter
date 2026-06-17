import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [username, setUsername] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [foodPellets, setFoodPellets] = useState([])
  const [playerPosition, setPlayerPosition] = useState({ x: 1500, y: 1000 })
  const [playerRotation, setPlayerRotation] = useState(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const viewRef = useRef(null)

  // 🐳 ALL 6 ANIMAL SPECIES CORRESPONDING PATH FILENAMES & TARGET DATA
  const tiers = [
    { n: "Sacabambaspis", s: 80, f: "/sacabambaspis.png" },
    { n: "Stethacanthus altonensis", s: 95, f: "/Stethacanthus altonensis.png" },
    { n: "Squalicorax pristodontus", s: 110, f: "/Squalicorax pristodontus.png" },
    { n: "Xiphiorhynchus kimblalocki", s: 125, f: "/Xiphiorhynchus kimblalocki.png" },
    { n: "Liopleurodon ferox", s: 145, f: "/Liopleurodon ferox.png" },
    { n: "Otodus megalodon", s: 165, f: "/Otodus megalodon.png" }
  ]
  
  const currentTierIndex = Math.min(5, Math.floor(score / 4500))

  useEffect(() => {
    if (!isPlaying) return
    const pellets = []
    for (let i = 0; i < 40; i++) {
      pellets.push({
        id: i,
        x: Math.floor(Math.random() * 2800) + 100,
        y: Math.floor(Math.random() * 1650) + 100,
        val: i % 4 === 0 ? 120 : 100,
        img: i % 4 === 0 ? "/ocean-food.png" : "/food.png"
      })
    }
    setFoodPellets(pellets)
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    const mm = (e) => {
      if (!viewRef.current) return
      const rect = viewRef.current.getBoundingClientRect()
      mousePos.current = { x: e.clientX - rect.left - (rect.width / 2), y: e.clientY - rect.top - (rect.height / 2) }
    }
    const tick = setInterval(() => {
      setPlayerPosition((p) => {
        const rad = Math.atan2(mousePos.current.y, mousePos.current.x), dist = Math.sqrt(mousePos.current.x ** 2 + mousePos.current.y ** 2)
        const spd = dist > 25 ? Math.min(dist * 0.05, 8) : 0
        if (spd > 0) setPlayerRotation(rad * (180 / Math.PI) + 90)
        return {
          x: Math.max(50, Math.min(2950, p.x + Math.cos(rad) * spd)),
          y: Math.max(50, Math.min(1725, p.y + Math.sin(rad) * spd))
        }
      })
      setFoodPellets((prev) => prev.map((f) => {
        const d = Math.sqrt((playerPosition.x - f.x) ** 2 + (playerPosition.y - f.y) ** 2)
        if (d < 30) {
          setScore((s) => s + f.val)
          return { ...f, x: Math.floor(Math.random() * 2800) + 100, y: Math.floor(Math.random() * 1650) + 100 }
        }
        return f
      }))
    }, 1000 / 60)
    window.addEventListener('mousemove', mm)
    return () => { window.removeEventListener('mousemove', mm); clearInterval(tick) }
  }, [isPlaying, playerPosition])

  return (
    <div style={{ textAlign: 'center', color: '#FFF', minHeight: '100vh', display: 'flex', background: '#104E8B', justifyContent: 'center', alignItems: 'center', userSelect: 'none', fontFamily: 'sans-serif' }}>
      <Head><title>Prehistooio</title></Head>
      {isPlaying ? (
        <div ref={viewRef} style={{ width: '800px', height: '600px', background: '#0b355e', border: '8px solid #2a437a', borderRadius: '24px', position: 'relative', overflow: 'hidden', cursor: 'crosshair' }}>
          
          <div style={{ position: 'absolute', top: '15px', left: '20px', textAlign: 'left', zIndex: 10, opacity: 0.8 }}>
            <span style={{ fontSize: '1.3rem', color: '#00FF1A', fontWeight: 'bold' }}>SCORE: {score}</span><br />
            <span style={{ fontSize: '0.9rem', color: '#FFD700', fontWeight: 'bold' }}>SPECIES: {tiers[currentTierIndex].n}</span>
          </div>
          <button style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff4d4d', border: 'none', color: '#FFF', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', zIndex: 10 }} onClick={() => { setIsPlaying(false); setScore(0); }}>Leave</button>

          <div style={{ position: 'absolute', width: '3000px', height: '2000px', backgroundColor: '#0b355e', backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,0.04) 2px,transparent 2px)', backgroundSize: '100px 100px', transform: `translate(${400 - playerPosition.x}px, ${300 - playerPosition.y}px)` }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '3000px', height: '260px', backgroundColor: '#5C4033', borderTop: '8px solid #3d2b22' }} />
            
            {foodPellets.map((p) => (
              <img key={p.id} src={p.img} alt="food" style={{ position: 'absolute', top: p.y, left: p.x, width: '20px', transform: 'translate(-50%, -50%)' }} />
            ))}

            <div style={{ position: 'absolute', top: playerPosition.y, left: playerPosition.x, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: tiers[currentTierIndex].s + 'px' }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>{username || "Guest"}</span>
              <div style={{ width: '100%', transform: `rotate(${playerRotation}deg)` }}>
                <img src={username.toUpperCase().replace(/\s/g, "").includes("(GHOUL)") ? "/ghoul.png" : tiers[currentTierIndex].f} alt="fish" style={{ width: '100%', display: 'block' }} onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '3.5rem', margin: 0 }}>Prehistooio</h1>
          <p style={{ opacity: 0.8 }}>Made by Polentacze - Inspired by Deeeepio</p>
          <form onSubmit={(e) => { e.preventDefault(); setIsPlaying(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Name..." maxLength={14} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', textAlign: 'center', width: '260px' }} />
            <button type="submit" style={{ background: '#00FF1A', border: 'none', color: '#104E8B', padding: '0.8rem', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>PLAY SANDBOX</button>
          </form>
        </main>
      )}
    </div>
  )
}
