import React, { useState, useEffect } from 'react';
import { synth } from './utils/SoundSynth';
import AuthOverlay from './components/AuthOverlay';
import Dashboard from './components/Dashboard';
import AIScanner from './components/AIScanner';
import BinDropGame from './components/BinDropGame';
import WasteCatalog from './components/WasteCatalog';
import Analytics from './components/Analytics';

const defaultAppState = {
  streak: 0,
  lastActionDate: "",
  co2Offset: 0.0,
  waterSaved: 0.0,
  totalItemsLogged: 0,
  itemsCategorized: {
    organic: 0,
    recyclable: 0,
    hazardous: 0,
    landfill: 0
  },
  gameHighScore: 0,
  level: 1,
  xp: 0,
  scannedToday: 0,
  gameStreakMaxToday: 0,
  readMercuryThermometer: false,
  readCatalogIds: [],
  historyLogs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [appState, setAppState] = useState(JSON.parse(JSON.stringify(defaultAppState)));
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Notification Toast Banner state
  const [alertText, setAlertText] = useState('');
  const [alertEmoji, setAlertEmoji] = useState('🏆');
  const [alertActive, setAlertActive] = useState(false);

  // Check user session on load
  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        if (data.username) {
          setUser(data.username);
          if (data.state) {
            setAppState({ ...JSON.parse(JSON.stringify(defaultAppState)), ...data.state });
          }
        }
      })
      .catch(err => {
        console.warn("API check session error, checking local backup:", err);
        const storedUser = localStorage.getItem("ecosegregate_active_user");
        if (storedUser) {
          setUser(storedUser);
          const storedState = localStorage.getItem("ecosegregate_state_" + storedUser);
          if (storedState) {
            try {
              setAppState({ ...JSON.parse(JSON.stringify(defaultAppState)), ...JSON.parse(storedState) });
            } catch (e) {
              console.error("Local storage state parsing failed", e);
            }
          }
        }
      });
  }, []);

  const triggerNotification = (text, emoji = "🏆") => {
    setAlertText(text);
    setAlertEmoji(emoji);
    setAlertActive(true);

    setTimeout(() => {
      setAlertActive(false);
    }, 4000);
  };

  const handleAuthSuccess = (username, serverState) => {
    setUser(username);
    localStorage.setItem("ecosegregate_active_user", username);
    if (serverState) {
      const merged = { ...JSON.parse(JSON.stringify(defaultAppState)), ...serverState };
      setAppState(merged);
      localStorage.setItem("ecosegregate_state_" + username, JSON.stringify(merged));
    } else {
      setAppState(JSON.parse(JSON.stringify(defaultAppState)));
    }
  };

  const saveAppStateToServer = (newState) => {
    setAppState(newState);
    if (user) {
      localStorage.setItem("ecosegregate_state_" + user, JSON.stringify(newState));

      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState)
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.warn("Backend save state error:", data.error);
        }
      })
      .catch(err => {
        console.warn("Network error syncing stats to backend database", err);
      });
    }
  };

  const handleTabChange = (tabId) => {
    synth.playClick();
    setActiveTab(tabId);
  };

  const toggleAudio = () => {
    synth.enabled = !synth.enabled;
    setAudioEnabled(synth.enabled);
    if (synth.enabled) {
      synth.playClick();
    }
  };

  const handleLogout = () => {
    synth.playClick();
    fetch('/api/logout', { method: 'POST' })
      .catch(err => console.error("Logout request error", err));

    localStorage.removeItem("ecosegregate_active_user");
    setUser(null);
    setAppState(JSON.parse(JSON.stringify(defaultAppState)));
    setActiveTab('dashboard');
    triggerNotification("Logged out successfully.", "🚪");
  };

  const handleResetSystem = () => {
    if (window.confirm("Are you sure you want to reset all waste stats, level, achievements, and local storage data for this account? This cannot be undone.")) {
      synth.playError();
      const cleanState = JSON.parse(JSON.stringify(defaultAppState));
      saveAppStateToServer(cleanState);
      triggerNotification("System Reset Complete!", "⚠️");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const getLevelTitle = (lvl) => {
    const titles = { 1: "Green Rookie", 2: "Waste Watcher", 3: "Recycling Specialist", 4: "Eco Conservator", 5: "Zero-Waste Sage" };
    return titles[lvl] || "Earth Champion";
  };

  const getLevelEmoji = (lvl) => {
    const emojis = { 1: "🌱", 2: "🪱", 3: "♻️", 4: "🌳", 5: "🌍" };
    return emojis[lvl] || "🌍";
  };

  const getXpPercent = () => {
    const xpThresholds = [0, 100, 250, 450, 700];
    const lvl = appState.level;
    const nextXP = xpThresholds[lvl] || 1000;
    const prevXP = xpThresholds[lvl - 1] || 0;
    return Math.min(100, ((appState.xp - prevXP) / (nextXP - prevXP)) * 100);
  };

  return (
    <div className="app-container">
      {/* Ambient background glow particles */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>

      {/* Global alert banner notification */}
      <div id="notification-banner" className={`notification-banner ${alertActive ? 'active' : 'hidden'}`}>
        <div className="notification-content">
          <span id="notification-icon">{alertEmoji}</span>
          <span id="notification-text">{alertText}</span>
        </div>
      </div>

      {/* Auth overlay modal (renders if logged out) */}
      <AuthOverlay 
        active={!user} 
        onAuthSuccess={handleAuthSuccess} 
        triggerNotification={triggerNotification} 
      />

      {user && (
        <>
          {/* Sidebar Navigation */}
          <aside className="sidebar">
            <div className="brand">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="brand-name">EcoSegregate</span>
            </div>

            {/* Profile widget */}
            <div className="profile-card">
              <div className="avatar-ring">
                <div className="avatar" id="profile-avatar">{getLevelEmoji(appState.level)}</div>
              </div>
              <div className="profile-info">
                <h4 id="user-level-title">{getLevelTitle(appState.level)}</h4>
                <p id="profile-username" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neon-blue)', marginBottom: '2px' }}>@{user}</p>
                <p id="user-exp-text">Level {appState.level} • {appState.xp} / {([0, 100, 250, 450, 700][appState.level] || 1000)} XP</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" id="user-exp-progress" style={{ width: `${getXpPercent()}%` }}></div>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="nav-links">
              <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabChange('dashboard')}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                <span>Dashboard</span>
              </button>
              <button className={`nav-btn ${activeTab === 'scanner' ? 'active' : ''}`} onClick={() => handleTabChange('scanner')}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                <span>AI Scanner</span>
              </button>
              <button className={`nav-btn ${activeTab === 'game' ? 'active' : ''}`} onClick={() => handleTabChange('game')}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><line x1="6" y1="12" x2="18" y2="12"></line><line x1="12" y1="6" x2="12" y2="18"></line></svg>
                <span>Bin Drop Game</span>
              </button>
              <button className={`nav-btn ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => handleTabChange('catalog')}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <span>Waste Catalog</span>
              </button>
              <button className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => handleTabChange('analytics')}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                <span>Analytics & achievements</span>
              </button>
            </nav>

            {/* Sidebar controls */}
            <div className="sidebar-footer">
              <button className={`control-btn ${!audioEnabled ? 'danger-hover' : ''}`} onClick={toggleAudio}>
                <span className="control-icon">{audioEnabled ? '🔊' : '🔇'}</span>
                <span className="control-text">Audio Synth</span>
              </button>
              <button className="control-btn danger-hover" onClick={handleResetSystem}>
                <span className="control-icon">⚠️</span>
                <span className="control-text">Reset System</span>
              </button>
              <button className="control-btn danger-hover" onClick={handleLogout}>
                <span className="control-icon">🚪</span>
                <span className="control-text">Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main workspace panels */}
          <main className="main-content">
            <header className="header">
              <h1>
                {activeTab === 'dashboard' ? 'Dashboard Overview' :
                 activeTab === 'scanner' ? 'AI Chemical Classifier Scanner' :
                 activeTab === 'game' ? 'Bin Drop Challenge Game' :
                 activeTab === 'catalog' ? 'Waste Material Registry' : 'Personal Eco Ledger'}
              </h1>
              <div className="stats-overview">
                <div className="header-stat">
                  <span className="stat-emoji">🔥</span>
                  <div className="stat-details">
                    <span className="stat-value">{appState.streak} Day{appState.streak !== 1 ? 's' : ''}</span>
                    <span className="stat-label">Segregation Streak</span>
                  </div>
                </div>
                <div className="header-stat">
                  <span className="stat-emoji">🌳</span>
                  <div className="stat-details">
                    <span className="stat-value">{appState.co2Offset.toFixed(2)} kg</span>
                    <span className="stat-label">CO₂ Offset</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Conditional Tab Rendering */}
            {activeTab === 'dashboard' && (
              <Dashboard appState={appState} onSwitchTab={handleTabChange} />
            )}
            {activeTab === 'scanner' && (
              <AIScanner 
                appState={appState} 
                onUpdateState={saveAppStateToServer} 
                triggerNotification={triggerNotification} 
              />
            )}
            {activeTab === 'game' && (
              <BinDropGame 
                appState={appState} 
                onUpdateState={saveAppStateToServer} 
                triggerNotification={triggerNotification} 
              />
            )}
            {activeTab === 'catalog' && (
              <WasteCatalog 
                appState={appState} 
                onUpdateState={saveAppStateToServer} 
              />
            )}
            {activeTab === 'analytics' && (
              <Analytics 
                appState={appState} 
                onUpdateState={saveAppStateToServer} 
                triggerNotification={triggerNotification} 
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}
