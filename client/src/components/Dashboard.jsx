import React, { useState } from 'react';
import { synth } from '../utils/SoundSynth';

const ecoTipsPool = [
  "Always rinse plastics and cans before recycling. Leftover food or liquids contaminate batches of materials, causing the entire container to end up in landfills.",
  "Plastic bags are the single biggest contaminant in recycling streams. They wrap around rotary sorting gears and shut down recycling facilities.",
  "Composting organic waste stops it from decomposing into harmful methane gas inside landfills. In landfills, food scraps produce methane, a carbon compound 25 times more dangerous than carbon dioxide.",
  "E-waste accounts for 70% of toxic waste in landfills. A single smartphone battery contains cadmium, lead, and cobalt that contaminate soil and ground drinking tables.",
  "Broken window panes, drinking glasses, and ceramics cannot be recycled with jars. They melt at higher heat specifications and weaken the glass batches.",
  "Steel food cans can be recycled endlessly without loss of strength. Recycling steel takes 75% less chemical electricity than making it from iron mines.",
  "Cardboard boxes should always be crushed flat. Leaving boxes intact fills transport trucks with air, increasing fuel transport footprints.",
  "Pizza box cardboard soaked with cheese grease cannot be recycled. Throw the greasy base into general waste or compost, and recycle the clean cardboard lid.",
  "Avoid buying products wrapped in multiple layers of materials like plastic foil mixtures (chips packets). They cannot be split up and are destined for landfills.",
  "Switching to reusable canvas grocery bags saves a household an average of 350 plastic bags per year from degrading into microplastic streams."
];

export default function Dashboard({ appState, onSwitchTab }) {
  const [tipIndex, setTipIndex] = useState(0);

  const handleNextTip = () => {
    synth.playClick();
    setTipIndex((prev) => (prev + 1) % ecoTipsPool.length);
  };

  const total = appState.totalItemsLogged;
  const landfill = appState.itemsCategorized.landfill;
  const diversionRate = total > 0 ? Math.round(((total - landfill) / total) * 100) : 0;

  // Diversion trend details
  let trendText = "First Steps";
  let trendClass = "metric-trend pos";
  let trendStyle = { background: 'rgba(0, 242, 254, 0.08)', color: 'var(--neon-blue)' };

  if (diversionRate >= 80) {
    trendText = "Excellent";
    trendStyle = { background: 'rgba(0, 245, 155, 0.1)', color: 'var(--neon-green)' };
  } else if (diversionRate >= 50) {
    trendText = "Developing";
    trendStyle = { background: 'rgba(0, 245, 155, 0.1)', color: 'var(--neon-green)' };
  } else if (total > 0) {
    trendText = "Needs Focus";
    trendStyle = { background: 'rgba(255, 65, 108, 0.1)', color: 'var(--neon-red)' };
  }

  // Daily quest progress calculations
  const scansToday = Math.min(3, appState.scannedToday);
  const isQuest1Done = scansToday >= 3;

  const streakToday = appState.gameStreakMaxToday;
  const isQuest2Done = streakToday >= 10;

  const didReadThermometer = appState.readMercuryThermometer;
  const isQuest3Done = didReadThermometer;

  return (
    <section className="tab-pane active" id="tab-dashboard">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h2>Track, Learn & Combat Climate Change</h2>
          <p>Every piece of waste sorted properly diverts trash from landfills, reduces greenhouse gas emissions, and recovers valuable resources. Start sorting today!</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => onSwitchTab('scanner')}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" className="btn-icon">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Launch Scanner
            </button>
            <button className="btn btn-secondary" onClick={() => onSwitchTab('game')}>
              🎮 Play Sorting Game
            </button>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="eco-sphere">
            <div className="sphere-orbit"></div>
            <div className="sphere-core">🌍</div>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon green-bg">🍃</span>
            <span className="metric-label">Landfill Diversion Rate</span>
          </div>
          <div className="metric-value-container">
            <span className="metric-value">{diversionRate}%</span>
            <span className={trendClass} style={trendStyle}>{trendText}</span>
          </div>
          <p className="metric-subtext">Percentage of scanned/sorted items kept away from the landfill.</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon blue-bg">🚰</span>
            <span className="metric-label">Water Equivalent Saved</span>
          </div>
          <div className="metric-value-container">
            <span className="metric-value">{appState.waterSaved.toFixed(1)} L</span>
          </div>
          <p className="metric-subtext">Estimated clean water saved by avoiding raw materials extraction.</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon purple-bg">📈</span>
            <span className="metric-label">Total Items Logged</span>
          </div>
          <div className="metric-value-container">
            <span className="metric-value">{appState.totalItemsLogged}</span>
          </div>
          <p className="metric-subtext">Combined items analyzed in the scanner and sorted in the game.</p>
        </div>
      </div>

      {/* Bottom Layout: Eco-Tip and Quests */}
      <div className="dashboard-secondary-grid">
        <div className="glass-card eco-tip-container">
          <div className="card-header">
            <h3>Eco-Tip of the Day</h3>
            <button className="icon-btn" onClick={handleNextTip} id="btn-next-tip" title="Load Next Tip">🔄</button>
          </div>
          <div className="tip-content">
            <blockquote id="eco-tip-quote">
              "{ecoTipsPool[tipIndex]}"
            </blockquote>
          </div>
        </div>

        <div className="glass-card quest-container">
          <h3>Daily Quests</h3>
          <ul className="quest-list">
            <li className={`quest-item ${isQuest1Done ? 'completed' : ''}`} id="quest-scanner">
              <div className="quest-checkbox" id="quest-cb-scanner"></div>
              <div className="quest-details">
                <span className="quest-title">Analyze waste items in AI Scanner</span>
                <span className="quest-progress" id="quest-prog-scanner">{scansToday} / 3 items</span>
              </div>
              <span className="quest-exp">+30 XP</span>
            </li>
            <li className={`quest-item ${isQuest2Done ? 'completed' : ''}`} id="quest-game">
              <div className="quest-checkbox" id="quest-cb-game"></div>
              <div className="quest-details">
                <span className="quest-title">Achieve a streak of 10 in the Game</span>
                <span className="quest-progress" id="quest-prog-game">{streakToday >= 10 ? 1 : 0} / 1 game</span>
              </div>
              <span className="quest-exp">+40 XP</span>
            </li>
            <li className={`quest-item ${isQuest3Done ? 'completed' : ''}`} id="quest-catalog">
              <div className="quest-checkbox" id="quest-cb-catalog"></div>
              <div className="quest-details">
                <span className="quest-title">Learn about 'Mercury Thermometers' in Catalog</span>
                <span className="quest-progress" id="quest-prog-catalog">{didReadThermometer ? 1 : 0} / 1 read</span>
              </div>
              <span className="quest-exp">+20 XP</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
