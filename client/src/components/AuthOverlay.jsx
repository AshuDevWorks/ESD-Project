import React, { useState } from 'react';
import { synth } from '../utils/SoundSynth';

export default function AuthOverlay({ active, onAuthSuccess, triggerNotification }) {
  const [tab, setTab] = useState('signin'); // 'signin' or 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!active) return null;

  const handleTabChange = (targetTab) => {
    synth.playClick();
    setTab(targetTab);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError('');

    const endpoint = tab === 'signin' ? '/api/login' : '/api/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      synth.playSuccess();
      const welcomeMsg = tab === 'signin' ? `Welcome back, ${data.username}!` : `Account created! Welcome, ${data.username}.`;
      triggerNotification(welcomeMsg, tab === 'signin' ? '👋' : '🎉');
      onAuthSuccess(data.username, data.state);
    } catch (err) {
      synth.playError();
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-overlay" className="auth-overlay active">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="logo-icon" style={{ margin: '0 auto 12px auto', display: 'flex', justifyContent: 'center', color: 'var(--neon-blue)' }}>
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="brand-name" style={{ fontSize: '2rem', textAlign: 'center', display: 'block', marginBottom: '8px' }}>EcoSegregate</h2>
          <p className="auth-subtitle" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Smart Waste Segregation Assistant
          </p>
        </div>

        {/* Tab Selection */}
        <div className="auth-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button
            className={`auth-tab-btn ${tab === 'signin' ? 'active' : ''}`}
            onClick={() => handleTabChange('signin')}
            style={{
              flexGrow: 1,
              background: 'none',
              border: 'none',
              color: tab === 'signin' ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: tab === 'signin' ? 600 : 500,
              fontSize: '1rem',
              padding: '8px',
              cursor: 'pointer',
              borderBottom: `2px solid ${tab === 'signin' ? 'var(--neon-blue)' : 'transparent'}`,
              outline: 'none',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabChange('signup')}
            style={{
              flexGrow: 1,
              background: 'none',
              border: 'none',
              color: tab === 'signup' ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: tab === 'signup' ? 600 : 500,
              fontSize: '1rem',
              padding: '8px',
              cursor: 'pointer',
              borderBottom: `2px solid ${tab === 'signup' ? 'var(--neon-green)' : 'transparent'}`,
              outline: 'none',
              transition: 'all 0.2s'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="auth-username" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Username
            </label>
            <input
              type="text"
              id="auth-username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={tab === 'signin' ? 'Enter username...' : 'Pick a username...'}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="auth-password" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              id="auth-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {error && (
            <div className="auth-error-msg" style={{ color: 'var(--neon-red)', fontSize: '0.8rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn ${tab === 'signin' ? 'btn-primary' : 'btn-success'} w-full`}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Processing...' : tab === 'signin' ? 'Sign In to Account' : 'Create Free Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
