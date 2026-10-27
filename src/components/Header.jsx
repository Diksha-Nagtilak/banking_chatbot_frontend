import React from 'react';
import {
  Landmark,
  Layers,
  SlidersHorizontal,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
  Binary,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { CUSTOMER_PROFILES } from '../context/customerProfiles';

export default function Header() {
  const {
    theme,
    toggleTheme,
    setViewMode,
    currentProfile,
    setCurrentProfile,
    isSidebarOpen,
    setIsSidebarOpen,
    isInspectorOpen,
    setIsInspectorOpen,
    setIsTopologyOpen,
    setIsSettingsOpen,
    healthInfo,
    refreshHealth,
  } = useChat();


  return (
    <header className="app-header">
      {/* Brand & Sidebar Toggle */}
      <div className="brand-section">
        <button
          className="btn-ghost"
          style={{ padding: '6px 8px' }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>

        <div className="brand-logo-icon">
          <Landmark size={20} />
        </div>

        <div className="brand-titles">
          <div className="brand-title">
            <span>AegisBank</span>
            <span className="badge-ai">AI Multi-Agent</span>
          </div>
          <div className="brand-subtitle">
            <span>Microsoft Agent Framework</span>
            <span>•</span>
            <span>Request Handler Gateway</span>
          </div>
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="header-actions">
        {/* Backend Health Status Badge */}
        <div
          className={`health-pill ${healthInfo.healthy ? 'healthy' : 'offline'}`}
          onClick={refreshHealth}
          title={healthInfo.healthy ? `Active: ${healthInfo.llm_provider || 'FastAPI Service'} (${healthInfo.latencyMs}ms)` : 'Backend Offline - Click to retry'}
          style={{ cursor: 'pointer' }}
        >
          <div className="health-dot" />
          <span>
            {healthInfo.healthy
              ? `${healthInfo.mock_mode ? 'Demo Engine' : 'Live Azure AI'} (${healthInfo.latencyMs}ms)`
              : 'Backend Offline'}
          </span>
        </div>

        {/* Customer Profile Picker */}
        <div style={{ position: 'relative' }}>
          <select
            value={currentProfile.id}
            onChange={(e) => {
              const p = CUSTOMER_PROFILES.find((prof) => prof.id === e.target.value);
              if (p) setCurrentProfile(p);
            }}
            className="btn-ghost"
            style={{ appearance: 'none', paddingRight: '28px', cursor: 'pointer' }}
            title="Switch Simulated Customer Profile"
          >
            {CUSTOMER_PROFILES.map((prof) => (
              <option key={prof.id} value={prof.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                👤 {prof.name} ({prof.tier})
              </option>
            ))}
          </select>
          <div
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
            }}
          >
            ▼
          </div>
        </div>

        {/* Multi-Agent System Topology */}
        <button
          className="btn-ghost"
          onClick={() => setIsTopologyOpen(true)}
          title="View Multi-Agent Ecosystem Architecture"
        >
          <Layers size={16} />
          <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>Agents</span>
        </button>

        {/* Intelligence Inspector Drawer Toggle */}
        <button
          className={`btn-ghost ${isInspectorOpen ? 'active' : ''}`}
          onClick={() => setIsInspectorOpen(!isInspectorOpen)}
          title="Toggle Deep Agent Inspector"
        >
          <Binary size={16} />
          <span>Inspector</span>
        </button>

        {/* Settings */}
        <button
          className="btn-ghost"
          style={{ padding: '7px 10px' }}
          onClick={() => setIsSettingsOpen(true)}
          title="Settings & API Endpoints"
        >
          <SlidersHorizontal size={16} />
        </button>

        {/* Switch to Simple Chatbot UI */}
        <button
          className="btn-ghost simple-switch-pill"
          onClick={() => setViewMode('simple')}
          title="Switch to Simple Chatbot UI"
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.15))',
            borderColor: 'rgba(56, 189, 248, 0.3)',
            color: 'var(--accent-cyan)',
            fontWeight: 600,
          }}
        >
          <Sparkles size={15} />
          <span>Simple Chat</span>
        </button>

        {/* Theme Switcher */}
        <button
          className="btn-ghost"
          style={{ padding: '7px 10px' }}
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
