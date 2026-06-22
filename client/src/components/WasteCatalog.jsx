import React, { useState } from 'react';
import { wasteDatabase } from '../utils/wasteDatabase';
import { synth } from '../utils/SoundSynth';

export default function WasteCatalog({ appState, onUpdateState }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleFilterClick = (filter) => {
    synth.playClick();
    setActiveFilter(filter);
  };

  const handleCardClick = (item) => {
    synth.playClick();
    setSelectedItem(item);

    // Track read catalog item in achievements
    const readIds = [...appState.readCatalogIds];
    let stateUpdated = false;
    let newReadMercury = appState.readMercuryThermometer;

    if (!readIds.includes(item.id)) {
      readIds.push(item.id);
      stateUpdated = true;
    }

    if (item.id === 'thermometer' && !appState.readMercuryThermometer) {
      newReadMercury = true;
      stateUpdated = true;
    }

    if (stateUpdated) {
      onUpdateState({
        ...appState,
        readCatalogIds: readIds,
        readMercuryThermometer: newReadMercury
      });
    }
  };

  const handleCloseModal = () => {
    synth.playClick();
    setSelectedItem(null);
  };

  const filteredItems = wasteDatabase.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="tab-pane active" id="tab-catalog">
      <div className="catalog-control-panel glass-card">
        <div className="search-box-container">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            id="catalog-search"
            placeholder="Search item registry (e.g. 'bottle', 'battery', 'paper')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="catalog-filters">
          <button className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => handleFilterClick('all')}>
            All Registry
          </button>
          <button className={`filter-pill ${activeFilter === 'organic' ? 'active' : ''}`} onClick={() => handleFilterClick('organic')}>
            🍏 Organic
          </button>
          <button className={`filter-pill ${activeFilter === 'recyclable' ? 'active' : ''}`} onClick={() => handleFilterClick('recyclable')}>
            ♻️ Recyclable
          </button>
          <button className={`filter-pill ${activeFilter === 'hazardous' ? 'active' : ''}`} onClick={() => handleFilterClick('hazardous')}>
            ⚠️ Hazardous
          </button>
          <button className={`filter-pill ${activeFilter === 'landfill' ? 'active' : ''}`} onClick={() => handleFilterClick('landfill')}>
            🗑️ Landfill
          </button>
        </div>
      </div>

      <div className="catalog-grid" id="catalog-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className={`catalog-card cat-${item.bin}`} onClick={() => handleCardClick(item)}>
            <div className="catalog-card-icon">{item.emoji}</div>
            <div className="catalog-card-name">{item.name}</div>
            <span className={`catalog-card-badge badge-${item.bin}`}>{item.category}</span>
          </div>
        ))}
      </div>

      {/* Detailed Modal for Waste Info */}
      {selectedItem && (
        <div id="catalog-modal" className="modal-overlay active" onClick={(e) => e.target.id === 'catalog-modal' && handleCloseModal()}>
          <div className="modal-card">
            <button className="modal-close-btn" onClick={handleCloseModal} id="btn-close-modal">✕</button>
            <div className={`modal-hero hero-${selectedItem.bin}`} id="modal-badge-bin">
              <div className="modal-main-icon" id="modal-main-emoji">{selectedItem.emoji}</div>
              <h2 id="modal-title">{selectedItem.name}</h2>
              <span className={`modal-badge badge-${selectedItem.bin}`} id="modal-badge-text">{selectedItem.category.toUpperCase()}</span>
            </div>
            <div className="modal-body">
              <div className="modal-metric-row">
                <div className="modal-mini-metric">
                  <span className="mini-lbl">Decomposition Time</span>
                  <span className="mini-val" id="modal-decomp">{selectedItem.decomp}</span>
                </div>
                <div className="modal-mini-metric">
                  <span className="mini-lbl">CO₂ Offset Potential</span>
                  <span className={`mini-val ${selectedItem.co2 > 0 ? 'text-green' : 'text-red'}`} id="modal-co2">
                    {selectedItem.co2 > 0 ? '+' : ''}{selectedItem.co2.toFixed(2)} kg
                  </span>
                </div>
              </div>
              
              <div className="modal-text-block">
                <h4>Recycling & Compost Guide</h4>
                <p id="modal-recycling-instructions">
                  {selectedItem.guidelines.join(' ')}
                </p>
              </div>

              <div className="modal-text-block">
                <h4>Alternative Swap / Reduction Tip</h4>
                <p id="modal-swaps-tips">
                  {selectedItem.tips}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
