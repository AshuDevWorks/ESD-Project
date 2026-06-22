import React, { useEffect } from 'react';
import { synth } from '../utils/SoundSynth';

export default function Analytics({ appState, onUpdateState, triggerNotification }) {
  const organicCnt = appState.itemsCategorized.organic;
  const recyclableCnt = appState.itemsCategorized.recyclable;
  const hazardousCnt = appState.itemsCategorized.hazardous;
  const landfillCnt = appState.itemsCategorized.landfill;
  const total = organicCnt + recyclableCnt + hazardousCnt + landfillCnt;

  const achievements = [
    {
      id: "recruit",
      name: "Recycle Rookie",
      desc: "Log 1 recyclable item in scanner or sorting game.",
      emoji: "♻️",
      unlocked: appState.itemsCategorized.recyclable > 0
    },
    {
      id: "compost",
      name: "Compost Master",
      desc: "Segregate 5 organic waste items correctly.",
      emoji: "🪱",
      unlocked: appState.itemsCategorized.organic >= 5
    },
    {
      id: "hazard",
      name: "Hazard Control",
      desc: "Keep 3 hazardous/e-waste items safely separated.",
      emoji: "⚠️",
      unlocked: appState.itemsCategorized.hazardous >= 3
    },
    {
      id: "streak_expert",
      name: "Sort Specialist",
      desc: "Achieve a sorting streak multiplier of x10 in the Game.",
      emoji: "⚡",
      unlocked: appState.gameStreakMaxToday >= 10 || appState.gameHighScore >= 150
    },
    {
      id: "collector",
      name: "Zero Waste Hero",
      desc: "Log 25 items across the assistant database.",
      emoji: "🌍",
      unlocked: appState.totalItemsLogged >= 25
    },
    {
      id: "scholar",
      name: "Eco Scholar",
      desc: "View detailed files of 5 catalog items to learn tips.",
      emoji: "📚",
      unlocked: appState.readCatalogIds.length >= 5
    },
    {
      id: "carbon_crusader",
      name: "Carbon Crusader",
      desc: "Save an equivalent of 5.0 kg of CO₂ emissions.",
      emoji: "🌳",
      unlocked: appState.co2Offset >= 5.0
    },
    {
      id: "sage",
      name: "Green Legend",
      desc: "Reach User Profile Level 5 (Zero-Waste Sage).",
      emoji: "🏆",
      unlocked: appState.level >= 5
    }
  ];

  // Side effect to handle newly unlocked achievements and reward XP
  useEffect(() => {
    let xpGranted = 0;
    achievements.forEach(ach => {
      if (ach.unlocked) {
        const key = `unlocked_ach_${ach.id}`;
        const wasUnlocked = localStorage.getItem(key) === "true";
        if (!wasUnlocked) {
          localStorage.setItem(key, "true");
          xpGranted += 50;
          
          // Trigger alert after a slight delay
          setTimeout(() => {
            synth.playLevelUp();
            triggerNotification(`Achievement Unlocked: ${ach.name}! (+50 XP)`, "🏆");
          }, 300);
        }
      }
    });

    if (xpGranted > 0) {
      // Calculate level scale: L1 (0-100), L2 (100-250), L3 (250-450), L4 (450-700), L5 (700+)
      const xpThresholds = [0, 100, 250, 450, 700, Infinity];
      const newXp = appState.xp + xpGranted;
      let newLvl = appState.level;

      for (let i = 1; i < xpThresholds.length; i++) {
        if (newXp >= xpThresholds[i - 1] && newXp < xpThresholds[i]) {
          newLvl = i;
          break;
        }
      }

      const hasLeveledUp = newLvl > appState.level;

      onUpdateState({
        ...appState,
        xp: newXp,
        level: newLvl
      });

      if (hasLeveledUp) {
        setTimeout(() => {
          synth.playLevelUp();
          const titles = { 1: "Green Rookie", 2: "Waste Watcher", 3: "Recycling Specialist", 4: "Eco Conservator", 5: "Zero-Waste Sage" };
          triggerNotification(`🎉 LEVEL UP! You are now a Level ${newLvl}: ${titles[newLvl] || "Earth Champion"}!`, "👑");
        }, 1200);
      }
    }
  }, [organicCnt, recyclableCnt, hazardousCnt, landfillCnt, appState.xp]);

  // Donut SVG Calculations
  const r = 70;
  const circumference = 2 * Math.PI * r; // ~439.82
  const recoveryRate = total > 0 ? Math.round(((total - landfillCnt) / total) * 100) : 0;

  const organicPct = total > 0 ? organicCnt / total : 0;
  const recyclablePct = total > 0 ? recyclableCnt / total : 0;
  const hazardousPct = total > 0 ? hazardousCnt / total : 0;
  const landfillPct = total > 0 ? landfillCnt / total : 0;

  const organicStroke = organicPct * circumference;
  const recyclableStroke = recyclablePct * circumference;
  const hazardousStroke = hazardousPct * circumference;
  const landfillStroke = landfillPct * circumference;

  // Trend Line Chart SVG Calculations (ViewBox: 500x200)
  const maxCO2 = Math.max(1.0, appState.co2Offset);
  const xStart = 40;
  const xStep = 440 / 6;
  const yBottom = 170;
  const yHeight = 150;

  let dPathStr = "";
  let dAreaStr = `M ${xStart} ${yBottom} `;
  let dots = [];

  appState.historyLogs.forEach((val, idx) => {
    const x = xStart + (idx * xStep);
    const ratio = maxCO2 > 0 ? (val / maxCO2) : 0;
    const y = yBottom - (ratio * yHeight);

    if (idx === 0) {
      dPathStr += `M ${x} ${y} `;
    } else {
      dPathStr += `L ${x} ${y} `;
    }
    dAreaStr += `L ${x} ${y} `;

    dots.push({ x, y, val, idx });
  });

  dAreaStr += `L ${xStart + (6 * xStep)} ${yBottom} Z`;

  return (
    <section className="tab-pane active" id="tab-analytics">
      <div className="analytics-layout">
        {/* Segregation Profile Donut */}
        <div className="glass-card chart-card">
          <h3>Segregation Profile</h3>
          <p className="chart-subtitle">Direct distribution of waste you have segregated across scanner and game sessions.</p>
          <div className="chart-flex">
            <div className="donut-chart-container">
              <svg viewBox="0 0 200 200" width="100%" height="200" id="svg-donut">
                <circle cx="100" cy="100" r={r} className="donut-bg" stroke="#1d2433" strokeWidth="20" fill="transparent"></circle>
                
                {/* Organic (Green) */}
                <circle cx="100" cy="100" r={r} id="donut-segment-organic" stroke="#00f59b" strokeWidth="20" 
                        strokeDasharray={`${organicStroke} ${circumference}`} strokeDashoffset={0} fill="transparent"
                        style={{ transition: 'stroke-dasharray 0.5s ease' }}></circle>
                
                {/* Recyclable (Blue) */}
                <circle cx="100" cy="100" r={r} id="donut-segment-recyclable" stroke="#00f2fe" strokeWidth="20" 
                        strokeDasharray={`${recyclableStroke} ${circumference}`} strokeDashoffset={-organicStroke} fill="transparent"
                        style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}></circle>
                
                {/* Hazardous (Red) */}
                <circle cx="100" cy="100" r={r} id="donut-segment-hazardous" stroke="#ff416c" strokeWidth="20" 
                        strokeDasharray={`${hazardousStroke} ${circumference}`} strokeDashoffset={-(organicStroke + recyclableStroke)} fill="transparent"
                        style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}></circle>
                
                {/* Landfill (Grey) */}
                <circle cx="100" cy="100" r={r} id="donut-segment-landfill" stroke="#8c92ac" strokeWidth="20" 
                        strokeDasharray={`${landfillStroke} ${circumference}`} strokeDashoffset={-(organicStroke + recyclableStroke + hazardousStroke)} fill="transparent"
                        style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}></circle>
                
                <text x="100" y="105" textAnchor="middle" id="donut-center-text" className="donut-text" fill="#ffffff">
                  {total > 0 ? `${recoveryRate}%` : '0%'}
                </text>
              </svg>
            </div>
            <div className="chart-legend">
              <div className="legend-row">
                <span className="color-dot bg-green"></span>
                <span>Organic: <strong id="lbl-cnt-organic">{organicCnt} item{organicCnt !== 1 ? 's' : ''}</strong></span>
              </div>
              <div className="legend-row">
                <span className="color-dot bg-blue"></span>
                <span>Recyclable: <strong id="lbl-cnt-recyclable">{recyclableCnt} item{recyclableCnt !== 1 ? 's' : ''}</strong></span>
              </div>
              <div className="legend-row">
                <span className="color-dot bg-red"></span>
                <span>Hazardous: <strong id="lbl-cnt-hazardous">{hazardousCnt} item{hazardousCnt !== 1 ? 's' : ''}</strong></span>
              </div>
              <div className="legend-row">
                <span className="color-dot bg-grey"></span>
                <span>Landfill: <strong id="lbl-cnt-landfill">{landfillCnt} item{landfillCnt !== 1 ? 's' : ''}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* CO₂ Offset Trend Graph */}
        <div className="glass-card chart-card">
          <h3>CO₂ Offset Over Time</h3>
          <p className="chart-subtitle">Progressive carbon savings (cumulative in kg) achieved through proper recycling and composting.</p>
          <div className="line-chart-container">
            <svg viewBox="0 0 500 200" width="100%" height="200" id="svg-trend">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#1d2433" strokeWidth="1"></line>
              <line x1="40" y1="70" x2="480" y2="70" stroke="#1d2433" strokeWidth="1"></line>
              <line x1="40" y1="120" x2="480" y2="120" stroke="#1d2433" strokeWidth="1"></line>
              <line x1="40" y1="170" x2="480" y2="170" stroke="#1d2433" strokeWidth="1"></line>
              
              {/* Area path below line */}
              {total > 0 && <path d={dAreaStr} fill="url(#trend-area-gradient)"></path>}
              
              {/* Line path */}
              {total > 0 && <path d={dPathStr} fill="none" stroke="url(#trend-gradient)" strokeWidth="3"></path>}
              
              {/* Dots on nodes */}
              <g id="trend-dots-group">
                {total > 0 && dots.map((dot) => (
                  <circle
                    key={dot.idx}
                    cx={dot.x}
                    cy={dot.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#00f2fe"
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                  >
                    <title>Day {dot.idx + 1}: {dot.val.toFixed(2)} kg CO₂</title>
                  </circle>
                ))}
              </g>
              
              {/* X/Y Axes Labels */}
              <text x="35" y="25" textAnchor="end" className="chart-axis-label" fill="#8c92ac">
                {maxCO2.toFixed(1)}
              </text>
              <text x="35" y="175" textAnchor="end" className="chart-axis-label" fill="#8c92ac">
                0.0
              </text>
              
              {/* Gradients def */}
              <defs>
                <linearGradient id="trend-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f2fe"></stop>
                  <stop offset="100%" stopColor="#00f59b"></stop>
                </linearGradient>
                <linearGradient id="trend-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="line-chart-x-labels">
              <span>Day 1</span>
              <span>Day 2</span>
              <span>Day 3</span>
              <span>Day 4</span>
              <span>Day 5</span>
              <span>Day 6</span>
              <span>Day 7</span>
            </div>
          </div>
        </div>

        {/* Badge Grid achievements */}
        <div className="glass-card achievements-card">
          <h3>Unlocked Achievements</h3>
          <p className="chart-subtitle">Accomplish goals to unlock badges and claim bonus XP multipliers.</p>
          <div className="badge-grid" id="achievements-grid">
            {achievements.map((ach) => (
              <div key={ach.id} className={`badge-card ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="badge-card-icon">{ach.emoji}</div>
                <div className="badge-card-info">
                  <h4 className="badge-card-name">{ach.name}</h4>
                  <p className="badge-card-desc">{ach.desc}</p>
                </div>
                <div className={`badge-status ${ach.unlocked ? 'unlocked-lbl' : 'locked-lbl'}`}>
                  {ach.unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
