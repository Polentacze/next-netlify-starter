              onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} alt="avatar" />
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
                            {propsList.kelp.map((k, idx) => <img key={idx} src="/kelp.png" alt="kelp" className="scrolling-kelp-prop" style={{ top: 1775, left: k.x, height: k.h }} onError={(e) => { e.target.style.display = 'none' }} />)}
            {propsList.volcano && <img src="/volcano.png" alt="volcano" className="scrolling-volcano-prop" style={{ top: propsList.volcano.y, left: propsList.volcano.x, width: propsList.volcano.w }} onError={(e) => { e.target.style.display = 'none' }} />}
            {propsList.bigRock && <img src="/big-rock.png" alt="rock" className="scrolling-rock-prop" style={{ top: propsList.bigRock.y + 25, left: propsList.bigRock.x, width: propsList.bigRock.w }} onError={(e) => { e.target.style.display = 'none' }} />}
            {foodPellets.map((p) => !p.isEaten && <img key={p.id} src={p.src || "/food.png"} alt="food" className="custom-food-sprite-pellet" style={{ top: p.y, left: p.x }} onError={(e) => { e.target.src = "/food.png" }} />)}
            <div style={{ position: 'absolute', top: playerPosition.y, left: playerPosition.x, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: evoTiers[activeTierIndex].scale + 'px', pointerEvents: 'none', background: 'transparent', backgroundColor: 'transparent' }}>
              <span style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'sans-serif', marginBottom: '8px', border: '1px solid ' + (detectTextColor(username) !== '#FFFFFF' ? detectTextColor(username) : '#00FF1A'), color: detectTextColor(username), whiteSpace: 'nowrap' }}>{username || "Guest"}</span>
              <div style={{ width: '100%', position: 'relative', transform: 'rotate(' + playerRotation + 'deg)', transition: 'transform 0.04s linear', background: 'transparent', backgroundColor: 'transparent' }}>
                <img src={(username || "").toUpperCase().replace(/\s/g, "").includes("(GHOUL)") ? "/ghoul.png" : evoTiers[activeTierIndex].file} alt="fish" className="player-fish-sprite" onError={(e) => { e.target.src = "/prehistoric-skeleton.png" }} />
                {isAbilityActive && activeTierIndex === 1 && (
                  <img 
                    src="/steth-ability.png" 
                    alt="Speed Surge Active" 
                    style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '65px', height: 'auto', background: 'transparent !important', backgroundColor: 'transparent !important', mixBlendMode: 'screen', pointerEvents: 'none' }} 
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
          <img src="/wiki-button.png" alt="Wiki" className="wiki-img" onClick={() => setIsWikiOpen(true)} />
          <div onClick={() => setIsWikiOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: isWikiOpen ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 105 }}>
            <div className="wiki-panel" onClick={(e) => e.stopPropagation()}><button className="close-btn" onClick={() => setIsWikiOpen(false)}>Close X</button><h2 className="ocean-title" style={{ fontSize: '2.2rem', textAlign: 'left', margin: '0' }}>Animal Wiki</h2>
            <div className="grid-container"><img src="/AnimalGrid.png" alt="Grid" className="grid-img" />{slots.map((s, i) => <div key={i} className="slot-over" style={{ top: slotPositions[i].t, left: slotPositions[i].l, width: "10.5%", height: "28%" }} onMouseEnter={() => setHoveredAnimal(slots[i])} onMouseLeave={() => setHoveredAnimal("")} />)}</div>
            <div className="hud-banner"><p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1.3rem', fontWeight: 'bold', color: hoveredAnimal ? '#00FF1A' : '#fff' }}>{hoveredAnimal || "Hover over a creature to analyze metadata"}</p></div></div>
          </div>
                  <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <h1 className="ocean-title" style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Prehistooio</h1>
            <p className="ocean-sub" style={{ fontSize: '1.1rem', opacity: '0.8', marginBottom: '1.5rem' }}>Made by Polentacze - Inspired by Deeeepio</p>
            <img src="/prehistoric-skeleton.png" alt="Skeleton" style={{ width: '160px', marginBottom: '1.5rem', borderRadius: '12px' }} onError={(e) => { e.target.src = "/deep-prehistoo.png" }} />
            <p className="ocean-sub" style={{ fontSize: '1.4rem', fontWeight: '500', marginBottom: '0.5rem' }}>Fight your Prehistoric foes</p>
                    <form className="launch-form" onSubmit={(e) => { e.preventDefault(); setIsPlaying(true); }}>
              <div className="input-wrap">
                <img src="/input-box.png" alt="Input" style={{ width: '100%' }} />
                <input type="text" className="field-text" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={14} placeholder="Enter Name..." style={{ color: '#333' }} />
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem', zIndex: 60 }}>
                <button type="button" className="play-btn" style={{ width: '180px', padding: 0, background: 'none', border: 'none', cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
                  <img src="/siege-play.png" alt="PLAY SIEGE" style={{ width: '100%' }} onError={(e) => { e.target.src = "/play-button.png" }} />
                </button>
                <button type="submit" className="play-btn" style={{ width: '180px', padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}>
                  <img src="/play-button.png" alt="PLAY NORMAL" style={{ width: '100%' }} />
                </button>
              </div>
            </form>
          </main>
        </>
      )}
    </div>
  )
}
