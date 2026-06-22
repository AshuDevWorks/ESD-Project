import React, { useState, useEffect, useRef } from 'react';
import { wasteDatabase } from '../utils/wasteDatabase';
import { synth } from '../utils/SoundSynth';

export default function AIScanner({ appState, onUpdateState, triggerNotification }) {
  const [model, setModel] = useState(null);
  const [modelStatus, setModelStatus] = useState('INITIALIZING...');
  
  const [activeItem, setActiveItem] = useState(null); // Loaded preview item
  const [scannerStatus, setScannerStatus] = useState('CAMERA READY');
  const [scanClass, setScanClass] = useState('status-indicator');
  const [isScanning, setIsScanning] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  
  // Results details
  const [scanResult, setScanResult] = useState(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasAnimRef = useRef(null);
  const scanTimerRef = useRef(null);

  const shelfItemIds = [
    "plastic_bottle", "banana_peel", "alkaline_battery", "styrofoam_cup",
    "glass_jar", "aluminum_can", "broken_mug", "led_bulb", "smartphone", "pizza_box"
  ];

  // 1. Initialize TensorFlow / MobileNet model
  useEffect(() => {
    const checkModelLoaded = () => {
      if (window.mobilenet) {
        setModelStatus('LOADING MODEL...');
        window.mobilenet.load()
          .then(loadedModel => {
            setModel(loadedModel);
            setModelStatus('CAMERA READY');
            setScannerStatus('CAMERA READY');
          })
          .catch(err => {
            console.error('MobileNet load error:', err);
            setModelStatus('AI MODEL ERROR');
            setScannerStatus('MOCK CAMERA ACTIVE');
          });
      } else {
        // Fallback checks
        setTimeout(() => {
          if (window.mobilenet) {
            checkModelLoaded();
          } else {
            setModelStatus('MOCK CAMERA ACTIVE');
            setScannerStatus('MOCK CAMERA ACTIVE');
          }
        }, 1500);
      }
    };

    checkModelLoaded();

    return () => {
      if (canvasAnimRef.current) cancelAnimationFrame(canvasAnimRef.current);
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, []);

  // 2. Particle canvas animation handler
  const startCanvasHUD = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedY: -(Math.random() * 1.5 + 0.5),
        opacity: Math.random()
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sci-fi corners overlay
      ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
      ctx.lineWidth = 2;
      const size = 30;
      const margin = 20;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(margin + size, margin);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin, margin + size);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(canvas.width - margin - size, margin);
      ctx.lineTo(canvas.width - margin, margin);
      ctx.lineTo(canvas.width - margin, margin + size);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(margin, canvas.height - margin - size);
      ctx.lineTo(margin, canvas.height - margin);
      ctx.lineTo(margin + size, canvas.height - margin);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(canvas.width - margin, canvas.height - margin - size);
      ctx.lineTo(canvas.width - margin, canvas.height - margin);
      ctx.lineTo(canvas.width - margin - size, canvas.height - margin);
      ctx.stroke();

      // Center radar circle
      ctx.strokeStyle = "rgba(0, 242, 254, 0.15)";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 60 + Math.sin(Date.now() / 200) * 5, 0, Math.PI * 2);
      ctx.stroke();

      // Floating bubbles
      particles.forEach(p => {
        ctx.fillStyle = `rgba(0, 242, 254, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      });

      canvasAnimRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const stopCanvasHUD = () => {
    if (canvasAnimRef.current) {
      cancelAnimationFrame(canvasAnimRef.current);
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // 3. Image uploading & selection helpers
  const handleSelectShelf = (item) => {
    synth.playClick();
    setActiveItem({
      ...item,
      source: 'shelf'
    });
    setScanResult(null);
    setIsLogged(false);
    setShowCorrection(false);
  };

  const triggerFileInput = () => {
    synth.playClick();
    fileInputRef.current.click();
  };

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const filenameLower = file.name.toLowerCase();
      let matchedDef = null;
      let isFilenameMatched = false;

      // File matches database keyword
      for (let item of wasteDatabase) {
        const cleanId = item.id.replace('_', ' ');
        if (filenameLower.includes(cleanId) || filenameLower.includes(item.id) || filenameLower.includes(item.name.toLowerCase())) {
          matchedDef = item;
          isFilenameMatched = true;
          break;
        }
      }

      if (!matchedDef) {
        if (filenameLower.includes('newspaper') || filenameLower.includes('newsprint') || filenameLower.includes('paper')) {
          matchedDef = wasteDatabase.find(x => x.id === 'newspaper');
          isFilenameMatched = true;
        } else if (filenameLower.includes('milk') || filenameLower.includes('packet') || filenameLower.includes('bag')) {
          matchedDef = wasteDatabase.find(x => x.id === 'milk_bag') || wasteDatabase.find(x => x.id === 'plastic_bag');
          isFilenameMatched = true;
        }
      }

      // Default random fallback if no keyword matches
      if (!matchedDef) {
        matchedDef = wasteDatabase[Math.floor(Math.random() * wasteDatabase.length)];
      }

      setActiveItem({
        ...matchedDef,
        name: `Uploaded File (${file.name})`,
        displayName: file.name,
        customImage: event.target.result,
        isFilenameMatched,
        source: 'upload'
      });
      setScanResult(null);
      setIsLogged(false);
      setShowCorrection(false);
      synth.playClick();
    };

    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearScanner = () => {
    synth.playClick();
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    stopCanvasHUD();
    setIsScanning(false);
    setActiveItem(null);
    setScanResult(null);
    setIsLogged(false);
    setShowCorrection(false);
    setScannerStatus(model ? 'CAMERA READY' : 'MOCK CAMERA ACTIVE');
    setScanClass('status-indicator');
  };

  // 4. inference Engine
  const startScanAnalysis = () => {
    if (!activeItem) return;

    setIsScanning(true);
    setScanResult(null);
    synth.playScan();
    setScannerStatus('SCANNING...');
    setScanClass('status-indicator scanning blinking');

    startCanvasHUD();

    // Perform analysis step
    scanTimerRef.current = setTimeout(() => {
      stopCanvasHUD();
      setIsScanning(false);
      setScannerStatus('CLASSIFICATION COMPLETE');
      setScanClass('status-indicator complete');

      if (activeItem.source === 'upload' && activeItem.customImage) {
        const imageElement = document.getElementById('viewfinder-img-element');

        if (activeItem.isFilenameMatched) {
          // Bypassed classifier because filename matched
          setScanResult({
            ...activeItem,
            confidence: "100.0%",
            rawLabel: "DESCRIPTIVE FILENAME MATCH"
          });
          synth.playSuccess();
        } else if (model && imageElement) {
          model.classify(imageElement)
            .then(predictions => {
              const topPred = predictions[0];
              const label = topPred ? topPred.className : "unknown object";
              const prob = topPred ? topPred.probability : 0.90;
              
              const classified = classifyItemDynamic(label, prob);
              classified.rawLabel = label.split(',')[0].trim().toUpperCase();
              classified.customImage = activeItem.customImage;
              classified.source = 'upload';
              
              setScanResult(classified);
              setActiveItem(classified);
              synth.playSuccess();
            })
            .catch(err => {
              console.error('Classification error:', err);
              // Fallback
              setScanResult({
                ...activeItem,
                confidence: "88.5%",
                rawLabel: "ERROR / FALLBACK"
              });
              synth.playSuccess();
            });
        } else {
          // Fallback if model not ready
          setScanResult({
            ...activeItem,
            confidence: "85.0%",
            rawLabel: "MOCK IMAGE CLASSIFIER"
          });
          synth.playSuccess();
        }
      } else {
        // Shelf item
        setScanResult({
          ...activeItem,
          confidence: (95.0 + Math.random() * 4.9).toFixed(1) + "%",
          rawLabel: "MOCK CHAMBER SENSORS"
        });
        synth.playSuccess();
      }
    }, 2500);
  };

  // Helper keyword mapper for dynamic classification
  const classifyItemDynamic = (rawLabel, probability) => {
    const synonyms = rawLabel.split(',').map(s => s.trim().toLowerCase());
    let matchedDb = null;

    // Direct database mapping keys
    const mobilenetToDbMap = {
      "newsprint": "newspaper", "newspaper": "newspaper", "paper": "newspaper",
      "packet": "milk_bag", "sachet": "milk_bag", "bag": "plastic_bag", "plastic bag": "plastic_bag",
      "water bottle": "plastic_bottle", "bottle": "plastic_bottle", "pop bottle": "plastic_bottle",
      "carton": "cardboard_box", "cardboard": "cardboard_box", "banana": "banana_peel", "apple": "apple_core",
      "battery": "alkaline_battery", "cellular telephone": "smartphone", "soda can": "aluminum_can",
      "tin can": "steel_can", "mug": "broken_mug", "cuppa": "styrofoam_cup", "bulb": "led_bulb",
      "thermometer": "thermometer", "leaves": "yard_waste", "jean": "old_jeans", "diaper": "dirty_diaper",
      "napkin": "used_napkin"
    };

    for (let syn of synonyms) {
      for (let key in mobilenetToDbMap) {
        if (syn === key || syn.includes(key)) {
          matchedDb = wasteDatabase.find(x => x.id === mobilenetToDbMap[key]);
          if (matchedDb) break;
        }
      }
      if (matchedDb) break;
    }

    if (matchedDb) {
      return { ...matchedDb, confidence: (probability * 100).toFixed(1) + "%" };
    }

    // Dynamic routing if no direct database match
    let category = 'landfill';
    const organicKeywords = ["banana", "apple", "peel", "fruit", "vegetable", "leaf", "plant", "food", "egg", "coffee"];
    const recyclableKeywords = ["bottle", "can", "glass", "container", "box", "carton", "paper", "cardboard", "metal"];
    const hazardousKeywords = ["battery", "phone", "device", "bulb", "thermometer", "medicine", "aerosol"];

    const labelText = rawLabel.toLowerCase();
    if (organicKeywords.some(kw => labelText.includes(kw))) category = 'organic';
    else if (recyclableKeywords.some(kw => labelText.includes(kw))) category = 'recyclable';
    else if (hazardousKeywords.some(kw => labelText.includes(kw))) category = 'hazardous';

    let emoji = "🗑️";
    let decomp = "500 Years";
    let co2 = -0.05;
    let water = 0.0;
    let guidelines = ["Dispose in the general landfill container.", "Avoid mixing recyclables or organics into this bin."];
    let tips = "Minimize landfill footprints by choosing items with zero-packaging designs.";

    if (category === 'organic') {
      emoji = "🍏"; decomp = "2 Months"; co2 = 0.04; water = 0.1;
      guidelines = ["Throw directly into the organic composting container.", "Ensure any plastic stickers are removed."];
      tips = "Composting organic waste stops it from decomposing into harmful methane gas inside landfills.";
    } else if (category === 'recyclable') {
      emoji = "♻️"; decomp = "100 Years"; co2 = 0.25; water = 3.5;
      guidelines = ["Rinse off food residues.", "Flatten cardboard boxes to save space."];
      tips = "Recycling recovers precious secondary materials, saving significant carbon extraction costs.";
    } else if (category === 'hazardous') {
      emoji = "⚠️"; decomp = "50 Years"; co2 = 0.50; water = 10.0;
      guidelines = ["NEVER dispose in household trash. Drop off at local hazardous e-waste hubs.", "Keep batteries separate, they pose a serious fire hazard."];
      tips = "Switch to long-lasting rechargeable batteries or energy-efficient devices to reduce e-waste volumes.";
    }

    const firstWord = synonyms[0] || "unknown object";
    const formattedName = firstWord.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
      id: "dynamic_" + Date.now(),
      name: formattedName,
      emoji,
      category,
      bin: category,
      decomp,
      co2,
      water,
      guidelines,
      tips,
      confidence: (probability * 100).toFixed(1) + "%"
    };
  };

  // Manual classification correction
  const handleApplyCorrection = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const matched = wasteDatabase.find(x => x.id === selectedId);
    if (matched) {
      const correctedResult = {
        ...scanResult,
        ...matched,
        confidence: 'Manually Corrected',
        bin: matched.bin,
        category: matched.category,
        decomp: matched.decomp,
        co2: matched.co2,
        water: matched.water,
        guidelines: matched.guidelines,
        tips: matched.tips
      };

      setScanResult(correctedResult);
      setActiveItem(correctedResult);
      setShowCorrection(false);
      synth.playSuccess();
      triggerNotification(`Updated classification to ${matched.emoji} ${matched.name}!`, "✏️");
    }
  };

  // Log to DB
  const handleLogResult = () => {
    if (!scanResult || isLogged) return;

    synth.playSuccess();
    setIsLogged(true);

    const loggedToday = appState.scannedToday + 1;

    // Streak tracker logic
    const todayStr = new Date().toISOString().split('T')[0];
    let currentStreak = appState.streak;

    if (appState.lastActionDate !== todayStr) {
      if (appState.lastActionDate) {
        const lastDate = new Date(appState.lastActionDate);
        const currDate = new Date(todayStr);
        const diffDays = Math.ceil(Math.abs(currDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak += 1;
          setTimeout(() => triggerNotification("🔥 Streak extended! Keep it up!", "🏆"), 1000);
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
    }

    // Update 7-day CO2 savings log
    const updatedHistory = [...appState.historyLogs];
    const newTotalCO2 = appState.co2Offset + Math.max(0, scanResult.co2);
    updatedHistory[6] = newTotalCO2;

    for (let i = 5; i >= 0; i--) {
      if (updatedHistory[i] === 0) {
        updatedHistory[i] = parseFloat((newTotalCO2 * (i / 6)).toFixed(2));
      }
    }

    // XP calculation
    const xpGranted = 10;
    const nextLvlXp = [0, 100, 250, 450, 700];
    let newLvl = appState.level;
    const newXp = appState.xp + xpGranted;
    
    const xpThresholds = [0, 100, 250, 450, 700, Infinity];
    for (let i = 1; i < xpThresholds.length; i++) {
      if (newXp >= xpThresholds[i - 1] && newXp < xpThresholds[i]) {
        newLvl = i;
        break;
      }
    }

    const hasLeveledUp = newLvl > appState.level;

    const newCategories = { ...appState.itemsCategorized };
    newCategories[scanResult.bin] += 1;

    const updatedState = {
      ...appState,
      totalItemsLogged: appState.totalItemsLogged + 1,
      co2Offset: newTotalCO2,
      waterSaved: appState.waterSaved + Math.max(0, scanResult.water),
      itemsCategorized: newCategories,
      scannedToday: loggedToday,
      streak: currentStreak,
      lastActionDate: todayStr,
      historyLogs: updatedHistory,
      xp: newXp,
      level: newLvl
    };

    onUpdateState(updatedState);
    triggerNotification(`Logged ${scanResult.emoji} ${scanResult.name}! stats updated.`, "🌿");

    if (hasLeveledUp) {
      setTimeout(() => {
        synth.playLevelUp();
        const titles = { 1: "Green Rookie", 2: "Waste Watcher", 3: "Recycling Specialist", 4: "Eco Conservator", 5: "Zero-Waste Sage" };
        triggerNotification(`🎉 LEVEL UP! You are now a Level ${newLvl}: ${titles[newLvl] || "Earth Champion"}!`, "👑");
      }, 1500);
    }
  };

  const displayName = activeItem?.name || '';
  const rawName = displayName.includes("Uploaded File") ? displayName.split("(")[0].trim() : displayName;

  return (
    <section className="tab-pane active" id="tab-scanner">
      <div className="scanner-layout">
        
        {/* Left Column - Viewfinder & Shelf */}
        <div className="scanner-col-left">
          
          {/* Viewfinder Screen */}
          <div className="glass-card scanner-viewfinder-card">
            <div className="card-header">
              <h3>Scanner Viewfinder</h3>
              <span className={`status-indicator ${isScanning ? 'scanning blinking' : scanResult ? 'complete' : ''}`} id="scanner-status-text">
                {isScanning ? 'SCANNING...' : scannerStatus}
              </span>
            </div>
            
            <div 
              className={`viewfinder ${dragActive ? 'drag-active' : ''} ${isScanning ? 'scanning' : ''}`}
              id="scanner-viewfinder"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="scan-overlay">
                <div className="scan-grid"></div>
                <div className={`scan-laser ${isScanning ? 'animating' : ''}`} id="scan-laser-line"></div>
              </div>

              <canvas ref={canvasRef} id="viewfinder-canvas"></canvas>

              {activeItem ? (
                activeItem.customImage ? (
                  <img src={activeItem.customImage} id="viewfinder-img-element" className="viewfinder-preview-img" alt="Scan target" />
                ) : (
                  <div style={{ zIndex: 5, textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '10px' }}>{activeItem.emoji}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>{activeItem.name}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Press "Analyze Item" to run molecular classification.
                    </p>
                  </div>
                )
              ) : (
                <div id="viewfinder-preview" className="viewfinder-preview-placeholder" onClick={triggerFileInput}>
                  <div className="upload-icon">📸</div>
                  <p>Select an item from the shelf or drag and drop an image here to scan</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="image-loader"
                    accept="image/*"
                    className="file-input-hidden"
                    onChange={handleImageUpload}
                  />
                  <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
                    Select Image File
                  </button>
                </div>
              )}
            </div>

            <div className="viewfinder-controls">
              <button 
                className="btn btn-primary" 
                id="btn-scan" 
                onClick={startScanAnalysis} 
                disabled={!activeItem || isScanning || !!scanResult}
              >
                🔍 Analyze Item
              </button>
              <button 
                className="btn btn-secondary" 
                id="btn-clear-scan" 
                onClick={handleClearScanner} 
                disabled={!activeItem || isScanning}
              >
                Eject Item
              </button>
            </div>
          </div>

          {/* Shelves card */}
          <div className="glass-card shelf-card">
            <h3>Item Shelf (Mock Objects)</h3>
            <p className="shelf-description">Click an item below to load it into the scanning chamber for analysis:</p>
            <div className="shelf-grid" id="scanner-shelf">
              {shelfItemIds.map(id => {
                const item = wasteDatabase.find(x => x.id === id);
                if (!item) return null;
                const isSelected = activeItem?.id === item.id && activeItem.source === 'shelf';

                return (
                  <div 
                    key={id} 
                    className={`shelf-item-bubble ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectShelf(item)}
                  >
                    <span className="shelf-emoji">{item.emoji}</span>
                    <span className="shelf-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Results Display */}
        <div className="scanner-col-right">
          <div className="glass-card scanner-result-card" id="scanner-result-panel">
            {!scanResult ? (
              <div className="empty-result" id="scanner-empty-msg">
                <div className="radar-ping"></div>
                <h4>Awaiting Item Input</h4>
                <p>Insert a mock waste item or load a custom picture to start the chemical signature analysis and view recycling directives.</p>
              </div>
            ) : (
              <div className="result-hud" id="scanner-hud-result">
                <div className="hud-header">
                  <h4 id="res-item-name">{scanResult.emoji} {rawName}</h4>
                  
                  <div className="confidence-container">
                    <span className="hud-label">CONFIDENCE MATCH</span>
                    <span className="hud-value" id="res-confidence">{scanResult.confidence}</span>
                  </div>

                  <div className="raw-prediction-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>RAW AI LABEL: <strong id="res-raw-label" style={{ color: 'var(--neon-blue)', textTransform: 'uppercase' }}>{scanResult.rawLabel}</strong></span>
                    <button 
                      id="btn-correct-item" 
                      onClick={() => setShowCorrection(!showCorrection)} 
                      style={{ background: 'none', border: 'none', color: 'var(--neon-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontWeight: 500, padding: '2px 4px', borderRadius: '4px' }}
                    >
                      ✏️ Correct It
                    </button>
                  </div>

                  {showCorrection && (
                    <div className="correction-dropdown-container" id="correction-select-box" style={{ marginTop: '10px', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Select the correct item:</label>
                      <select 
                        id="correction-dropdown" 
                        onChange={handleApplyCorrection}
                        defaultValue=""
                        style={{ width: '100%', background: '#070913', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="" disabled>-- Choose correct item --</option>
                        {[...wasteDatabase].sort((a,b) => a.name.localeCompare(b.name)).map(item => (
                          <option key={item.id} value={item.id}>
                            {item.emoji} {item.name} ({item.category.toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className={`bin-classification-banner bin-${scanResult.bin}`} id="res-bin-banner">
                  <span id="res-bin-icon">
                    {scanResult.bin === 'organic' ? '🍏' : scanResult.bin === 'recyclable' ? '♻️' : scanResult.bin === 'hazardous' ? '⚠️' : '🗑️'}
                  </span>
                  <div className="bin-banner-text">
                    <span id="res-bin-title">
                      {scanResult.bin === 'organic' ? 'ORGANIC WASTE BIN (GREEN)' :
                       scanResult.bin === 'recyclable' ? 'RECYCLABLE BIN (BLUE)' :
                       scanResult.bin === 'hazardous' ? 'HAZARDOUS & E-WASTE (RED)' : 'LANDFILL BIN (GREY)'}
                    </span>
                    <p id="res-bin-desc">
                      {scanResult.bin === 'organic' ? 'Biodegradable materials that break down into fertilizer.' :
                       scanResult.bin === 'recyclable' ? 'Clean items suitable for secondary materials recovery.' :
                       scanResult.bin === 'hazardous' ? 'Contains toxic metals or chemical hazard; requires specialized dropoff.' : 
                       'Non-recyclable items heading to municipal burial landfill.'}
                    </p>
                  </div>
                </div>

                <div className="hud-stats-grid">
                  <div className="hud-stat-box">
                    <span className="hud-stat-label">DECOMPOSITION</span>
                    <span className="hud-stat-val" id="res-decomp">{scanResult.decomp}</span>
                  </div>
                  <div className="hud-stat-box">
                    <span className="hud-stat-label">CARBON IMPACT</span>
                    <span className={`hud-stat-val ${scanResult.co2 > 0 ? 'text-green' : 'text-red'}`} id="res-carbon">
                      {scanResult.co2 > 0 ? '+' : ''}{scanResult.co2.toFixed(2)} kg CO₂
                    </span>
                  </div>
                </div>

                <div className="hud-guidelines">
                  <h5>Segregation Guidelines</h5>
                  <ul className="guidelines-list" id="res-guidelines-list">
                    {scanResult.guidelines.map((gl, i) => (
                      <li key={i}>{gl}</li>
                    ))}
                  </ul>
                </div>

                <div className="hud-footer">
                  <button 
                    className="btn btn-success w-full" 
                    id="btn-confirm-log" 
                    onClick={handleLogResult}
                    disabled={isLogged}
                  >
                    {isLogged ? 'Logged successfully!' : 'Log Item to Daily Ledger (+10 XP)'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
