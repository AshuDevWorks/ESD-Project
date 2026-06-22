import React, { useState, useEffect, useRef } from 'react';
import { wasteDatabase } from '../utils/wasteDatabase';
import { synth } from '../utils/SoundSynth';

export default function BinDropGame({ appState, onUpdateState, triggerNotification }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [speed, setSpeed] = useState(1.8);
  const [items, setItems] = useState([]); // Array of falling items
  const [gameOver, setGameOver] = useState(false);
  const [maxStreakThisGame, setMaxStreakThisGame] = useState(0);

  const stageRef = useRef(null);
  const gameLoopRef = useRef(null);
  const spawnTimerRef = useRef(null);
  
  // Track references in refs to bypass stale React state closures in requestAnimationFrame loop
  const stateRef = useRef({
    isPlaying: false,
    isPaused: false,
    items: [],
    speed: 1.8,
    score: 0,
    streak: 0,
    lives: 3,
    maxStreak: 0,
    lastSpawn: 0
  });

  // Sync state values to refs
  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
    stateRef.current.isPaused = isPaused;
    stateRef.current.items = items;
    stateRef.current.speed = speed;
    stateRef.current.score = score;
    stateRef.current.streak = streak;
    stateRef.current.lives = lives;
    stateRef.current.maxStreak = maxStreakThisGame;
  }, [isPlaying, isPaused, items, speed, score, streak, lives, maxStreakThisGame]);

  // Clean up loops on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  const handleStartGame = () => {
    synth.playClick();
    
    // Reset parameters
    setScore(0);
    setStreak(0);
    setLives(3);
    setSpeed(1.8);
    setItems([]);
    setGameOver(false);
    setMaxStreakThisGame(0);

    stateRef.current = {
      isPlaying: true,
      isPaused: false,
      items: [],
      speed: 1.8,
      score: 0,
      streak: 0,
      lives: 3,
      maxStreak: 0,
      lastSpawn: Date.now()
    };

    setIsPlaying(true);
    setIsPaused(false);

    // Trigger loop
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    gameLoopRef.current = requestAnimationFrame(runGameLoop);
  };

  const handlePauseGame = () => {
    synth.playClick();
    setIsPaused(prev => !prev);
  };

  const terminateGame = (currentScore, finalStreak, finalLives) => {
    setIsPlaying(false);
    setGameOver(true);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);

    // Award XP (1 XP per 5 points)
    const xpReward = Math.floor(currentScore / 5);
    const newXp = appState.xp + xpReward;

    // Check highscore
    let newHighScore = appState.gameHighScore;
    if (currentScore > appState.gameHighScore) {
      newHighScore = currentScore;
      setTimeout(() => triggerNotification(`🏆 New Arcade Record: ${currentScore}!`, "🎮"), 800);
    }

    // Sync streak metrics
    let newStreakMaxToday = appState.gameStreakMaxToday;
    if (finalStreak > appState.gameStreakMaxToday) {
      newStreakMaxToday = finalStreak;
    }

    // Check level scaling
    const xpThresholds = [0, 100, 250, 450, 700, Infinity];
    let newLvl = appState.level;
    for (let i = 1; i < xpThresholds.length; i++) {
      if (newXp >= xpThresholds[i - 1] && newXp < xpThresholds[i]) {
        newLvl = i;
        break;
      }
    }
    const hasLeveledUp = newLvl > appState.level;

    // Sync action streak dates
    const todayStr = new Date().toISOString().split('T')[0];
    let appStreak = appState.streak;
    if (appState.lastActionDate !== todayStr) {
      if (appState.lastActionDate) {
        const lastDate = new Date(appState.lastActionDate);
        const currDate = new Date(todayStr);
        const diffDays = Math.ceil(Math.abs(currDate - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          appStreak += 1;
          setTimeout(() => triggerNotification("🔥 Streak extended! Keep it up!", "🏆"), 1500);
        } else {
          appStreak = 1;
        }
      } else {
        appStreak = 1;
      }
    }

    onUpdateState({
      ...appState,
      gameHighScore: newHighScore,
      gameStreakMaxToday: newStreakMaxToday,
      xp: newXp,
      level: newLvl,
      streak: appStreak,
      lastActionDate: todayStr
    });

    if (hasLeveledUp) {
      setTimeout(() => {
        synth.playLevelUp();
        const titles = { 1: "Green Rookie", 2: "Waste Watcher", 3: "Recycling Specialist", 4: "Eco Conservator", 5: "Zero-Waste Sage" };
        triggerNotification(`🎉 LEVEL UP! You are now a Level ${newLvl}: ${titles[newLvl] || "Earth Champion"}!`, "👑");
      }, 2000);
    }
  };

  // 5. Game Loop details
  const runGameLoop = () => {
    const state = stateRef.current;
    if (!state.isPlaying) return;

    if (!state.isPaused) {
      const stage = stageRef.current;
      if (!stage) return;
      const stageHeight = stage.getBoundingClientRect().height;

      // Update Y offsets
      let nextItems = state.items.map(item => {
        if (item.isDragging) return item;
        return {
          ...item,
          top: item.top + state.speed
        };
      });

      // Check boundary misses
      const missed = nextItems.filter(item => !item.isDragging && item.top >= stageHeight - 80);
      const active = nextItems.filter(item => item.isDragging || item.top < stageHeight - 80);

      let finalLives = state.lives;
      let finalStreak = state.streak;

      if (missed.length > 0) {
        synth.playError();
        finalStreak = 0;
        finalLives = Math.max(0, state.lives - missed.length);
        
        setStreak(0);
        setLives(finalLives);
      }

      // Check game over
      if (finalLives <= 0) {
        setItems([]);
        terminateGame(state.score, state.maxStreak, 0);
        return;
      }

      // Spawn falling item check
      const now = Date.now();
      const spawnRate = Math.max(1600, 3200 - (state.score * 3.5)); // Spawn faster as scores go up
      
      if (now - state.lastSpawn >= spawnRate && active.length < 3) {
        // Random selection from DB
        const def = wasteDatabase[Math.floor(Math.random() * wasteDatabase.length)];
        const stageWidth = stage.getBoundingClientRect().width;
        
        const itemWidth = 70;
        const startX = Math.random() * (stageWidth - itemWidth);

        active.push({
          id: Date.now() + "_" + Math.random(),
          top: -80,
          left: startX,
          def: def,
          isDragging: false,
          dragX: 0,
          dragY: 0
        });

        state.lastSpawn = now;
      }

      setItems(active);
    }

    gameLoopRef.current = requestAnimationFrame(runGameLoop);
  };

  // 6. Pointer dragging interactions
  const handlePointerDown = (e, item) => {
    if (!isPlaying || isPaused) return;

    synth.playClick();
    const stage = stageRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();

    // Get click offset relative to circle center
    const clickedX = e.clientX - stageRect.left - item.left;
    const clickedY = e.clientY - stageRect.top - item.top;

    const next = items.map(x => {
      if (x.id === item.id) {
        return {
          ...x,
          isDragging: true,
          offsetX: clickedX,
          offsetY: clickedY,
          dragX: item.left,
          dragY: item.top
        };
      }
      return x;
    });
    setItems(next);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e, item) => {
    if (!item.isDragging) return;

    const stage = stageRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();

    // Bounded coordinates
    const x = e.clientX - stageRect.left - item.offsetX;
    const y = e.clientY - stageRect.top - item.offsetY;

    const boundedX = Math.max(0, Math.min(stageRect.width - 70, x));
    const boundedY = Math.max(-100, Math.min(stageRect.height + 40, y));

    const next = items.map(x => {
      if (x.id === item.id) {
        return {
          ...x,
          left: boundedX,
          top: boundedY
        };
      }
      return x;
    });
    setItems(next);

    // Highlight intersected bin column
    checkBinHighlight(boundedX, boundedY, stageRect);
  };

  const handlePointerUp = (e, item) => {
    if (!item.isDragging) return;

    e.target.releasePointerCapture(e.pointerId);

    // Clear highlights
    clearBinHighlights();

    const stage = stageRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    const stageWidth = stageRect.width;
    const stageHeight = stageRect.height;

    // Check collision bin drop
    const binColWidth = stageWidth / 4;
    const isOverBins = item.top >= stageHeight - 140; // bottom section

    let droppedBin = null;
    if (isOverBins) {
      const colIdx = Math.floor((item.left + 35) / binColWidth);
      const bins = ["organic", "recyclable", "hazardous", "landfill"];
      droppedBin = bins[colIdx] || null;
    }

    if (droppedBin) {
      if (item.def.bin === droppedBin) {
        // Correct classification
        synth.playSuccess();
        const mult = Math.floor((streak + 1) / 5) + 1;
        const newScore = score + 10 * mult;
        const newStreak = streak + 1;
        const newSpeed = speed + 0.05;

        setScore(newScore);
        setStreak(newStreak);
        setSpeed(newSpeed);

        if (newStreak > maxStreakThisGame) {
          setMaxStreakThisGame(newStreak);
        }

        // Award stats progress (database values)
        const updatedCategories = { ...appState.itemsCategorized };
        updatedCategories[item.def.bin] += 1;

        onUpdateState({
          ...appState,
          totalItemsLogged: appState.totalItemsLogged + 1,
          co2Offset: appState.co2Offset + Math.max(0, item.def.co2),
          waterSaved: appState.waterSaved + Math.max(0, item.def.water),
          itemsCategorized: updatedCategories
        });

        // Remove item from state list
        setItems(prev => prev.filter(x => x.id !== item.id));
      } else {
        // Incorrect drop bin
        synth.playError();
        const newLives = Math.max(0, lives - 1);
        setStreak(0);
        setLives(newLives);

        setItems(prev => prev.filter(x => x.id !== item.id));

        if (newLives <= 0) {
          terminateGame(score, maxStreakThisGame, 0);
        }
      }
    } else {
      // Released in open space, disable dragging and let gravity take over
      const next = items.map(x => {
        if (x.id === item.id) {
          return { ...x, isDragging: false };
        }
        return x;
      });
      setItems(next);
    }
  };

  const checkBinHighlight = (left, top, stageRect) => {
    const stageWidth = stageRect.width;
    const stageHeight = stageRect.height;
    const binColWidth = stageWidth / 4;
    const isOverBins = top >= stageHeight - 140;

    const bins = ["organic", "recyclable", "hazardous", "landfill"];
    bins.forEach((b, i) => {
      const el = document.getElementById(`bin-drop-${b}`);
      if (!el) return;

      const isCurrentBin = isOverBins && Math.floor((left + 35) / binColWidth) === i;
      if (isCurrentBin) {
        el.classList.add("hover-active");
      } else {
        el.classList.remove("hover-active");
      }
    });
  };

  const clearBinHighlights = () => {
    const bins = ["organic", "recyclable", "hazardous", "landfill"];
    bins.forEach(b => {
      const el = document.getElementById(`bin-drop-${b}`);
      if (el) el.classList.remove("hover-active");
    });
  };

  return (
    <section className="tab-pane active" id="tab-game">
      <div className="game-layout">
        
        {/* Game console frame */}
        <div className="game-console">
          
          {/* Header Dashboard */}
          <div className="console-header">
            <div className="score-panel">
              <span className="panel-label">SCORE</span>
              <span className="panel-val" id="game-score">{String(score).padStart(4, '0')}</span>
            </div>
            <div className="multiplier-panel">
              <span className="panel-label">STREAK</span>
              <span className="panel-val" id="game-streak">
                x{Math.floor(streak / 5) + 1} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>(Streak: {streak})</span>
              </span>
            </div>
            <div className="lives-panel">
              <span className="panel-label">LIVES</span>
              <span className="lives-container" id="game-lives">
                {Array.from({ length: 3 }).map((_, i) => (i < lives ? "❤️" : "🖤")).join('')}
              </span>
            </div>
          </div>

          {/* Console screen */}
          <div className="console-screen" id="game-screen">
            <div className="game-grid-layer"></div>

            {/* Start overlay screen */}
            {!isPlaying && !gameOver && (
              <div className="game-overlay active" id="game-start-overlay">
                <div className="arcade-logo">BIN DROP</div>
                <p>Waste items will descend from the top of the screen. Drag and drop them into the correct colored bin at the bottom before they hit the ground!</p>
                <div className="bins-legend">
                  <div className="legend-item"><span className="color-dot bg-green"></span> Compostable</div>
                  <div className="legend-item"><span className="color-dot bg-blue"></span> Recyclable</div>
                  <div className="legend-item"><span className="color-dot bg-red"></span> Hazard/E-waste</div>
                  <div className="legend-item"><span className="color-dot bg-grey"></span> Landfill</div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleStartGame}>Start Simulation</button>
              </div>
            )}

            {/* Game Over overlay screen */}
            {gameOver && (
              <div className="game-overlay" id="game-over-overlay">
                <div className="arcade-logo danger-text">SIMULATION TERMINATED</div>
                <div className="score-summary-card">
                  <p>Final Score: <strong>{score}</strong></p>
                  <p>Max Streak: <strong>x{Math.floor(maxStreakThisGame / 5) + 1} ({maxStreakThisGame})</strong></p>
                  <p>XP Earned: <strong>+{Math.floor(score / 5)} XP</strong></p>
                </div>
                <button className="btn btn-primary" onClick={handleStartGame}>Play Again</button>
              </div>
            )}

            {/* Active game stage */}
            <div ref={stageRef} className="game-stage" id="game-stage">
              {isPlaying && items.map((item) => (
                <div
                  key={item.id}
                  className="falling-item"
                  style={{
                    left: `${item.left}px`,
                    top: `${item.top}px`,
                    position: 'absolute'
                  }}
                  onPointerDown={(e) => handlePointerDown(e, item)}
                  onPointerMove={(e) => handlePointerMove(e, item)}
                  onPointerUp={(e) => handlePointerUp(e, item)}
                >
                  <span className="falling-emoji">{item.def.emoji}</span>
                  <span className="falling-label">{item.def.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            {/* Bins Drop targets */}
            <div className="game-bins-row">
              <div className="game-bin bin-green" data-bin="organic" id="bin-drop-organic">
                <div className="bin-glow"></div>
                <div className="bin-sticker">ORGANIC</div>
                <div className="bin-icon">🍏</div>
              </div>
              <div className="game-bin bin-blue" data-bin="recyclable" id="bin-drop-recyclable">
                <div className="bin-glow"></div>
                <div className="bin-sticker">RECYCLE</div>
                <div className="bin-icon">♻️</div>
              </div>
              <div className="game-bin bin-red" data-bin="hazardous" id="bin-drop-hazardous">
                <div className="bin-glow"></div>
                <div className="bin-sticker">HAZARD</div>
                <div className="bin-icon">⚠️</div>
              </div>
              <div className="game-bin bin-grey" data-bin="landfill" id="bin-drop-landfill">
                <div className="bin-glow"></div>
                <div className="bin-sticker">LANDFILL</div>
                <div className="bin-icon">🗑️</div>
              </div>
            </div>

          </div>

          {/* Pause game console controls */}
          <div className="console-controls">
            <p className="console-hint">🎮 Drag the falling items directly into the correct trash bins before they fall too low!</p>
            <button 
              className="btn btn-secondary btn-sm" 
              id="game-pause-btn" 
              onClick={handlePauseGame}
              disabled={!isPlaying}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>

        </div>

        {/* Arcade Records Sidebar */}
        <div className="game-sidebar glass-card">
          <h3>Arcade Records</h3>
          <div className="high-score-board">
            <div className="hs-row highlight">
              <span>Personal Best</span>
              <span id="pb-score-val">{String(appState.gameHighScore).padStart(4, '0')}</span>
            </div>
            <p className="stats-footer-text">Play to increase your highscore, unlock achievements, and gain levels.</p>
          </div>

          <div className="educational-help">
            <h4>Quick Guide</h4>
            <ul className="help-list">
              <li><strong>Organics:</strong> Food, peels, leaves, coffee, shells.</li>
              <li><strong>Recyclables:</strong> Clean bottles, cardboard, metal tins, clean paper.</li>
              <li><strong>Hazardous:</strong> Batteries, phones, bulbs, medical supplies, spray cans.</li>
              <li><strong>Landfill:</strong> Soft wraps, greasy boxes, dirty tissues, styrofoam, broken cups.</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
