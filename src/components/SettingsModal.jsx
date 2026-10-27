import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Server,
  Globe,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import {
  getApiBaseUrl,
  setApiBaseUrl,
  checkBackendHealth,
  DEFAULT_API_BASE,
  AZURE_PRODUCTION_BACKEND,
} from '../services/api';

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, healthInfo, refreshHealth } = useChat();
  const [apiUrl, setApiUrl] = useState(() => getApiBaseUrl());
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    setApiBaseUrl(apiUrl);
    refreshHealth();
    setIsSettingsOpen(false);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    setApiBaseUrl(apiUrl);
    const result = await checkBackendHealth();
    setTestResult(result);
    setIsTesting(false);
  };

  const handleClearData = () => {
    if (confirm('Clear all local chat history and sessions?')) {
      localStorage.removeItem('aegis_sessions');
      window.location.reload();
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <SlidersHorizontal size={20} color="var(--accent-cyan)" />
            <span>Connection & Agent Settings</span>
          </div>
          <button className="btn-ghost" onClick={() => setIsSettingsOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* API Base URL Configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Backend API Base URL
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder={DEFAULT_API_BASE || 'http://127.0.0.1:8000'}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                }}
              />
              <button
                className="btn-ghost"
                onClick={handleTest}
                disabled={isTesting}
                style={{ whiteSpace: 'nowrap' }}
              >
                <Server size={14} />
                <span>{isTesting ? 'Pinging...' : 'Test Connection'}</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Presets:</span>
              <button
                type="button"
                className="btn-ghost"
                style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                onClick={() => setApiUrl(AZURE_PRODUCTION_BACKEND)}
                title="Azure Web App Backend"
              >
                <Globe size={11} /> Azure Cloud
              </button>
              <button
                type="button"
                className="btn-ghost"
                style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                onClick={() => setApiUrl('http://127.0.0.1:8000')}
                title="Local FastAPI Port 8000"
              >
                Localhost:8000
              </button>
              <button
                type="button"
                className="btn-ghost"
                style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                onClick={() => setApiUrl('')}
                title="Use Auto / Environment Default"
              >
                Auto ({DEFAULT_API_BASE ? 'Cloud' : 'Vite Proxy'})
              </button>
            </div>

            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Default: <code>{DEFAULT_API_BASE || 'Local Vite Proxy (http://127.0.0.1:8000)'}</code>. Configurable via <code>VITE_API_BASE_URL</code> environment variable.
            </span>
          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: testResult.healthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                border: `1px solid ${testResult.healthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.78rem',
                color: testResult.healthy ? 'var(--accent-emerald)' : 'var(--accent-rose)',
              }}
            >
              {testResult.healthy ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <div>
                {testResult.healthy ? (
                  <span>
                    Connected to <strong>{testResult.service}</strong> (Response time: {testResult.latencyMs}ms, Provider: {testResult.llm_provider})
                  </span>
                ) : (
                  <span>Connection failed: {testResult.error || testResult.status}. Ensure backend is running.</span>
                )}
              </div>
            </div>
          )}

          {/* Active Backend Info */}
          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Active Backend Diagnostics</span>
            <div>Service: {healthInfo.service || 'Enterprise Banking Chatbot API'}</div>
            <div>Version: {healthInfo.version || '1.0.0'}</div>
            <div>Agent Framework: {healthInfo.agent_framework || 'Microsoft Agent Framework'}</div>
            <div>Active Provider: {healthInfo.llm_provider || 'Mock Banking Engine (Offline/Local)'}</div>
          </div>

          {/* Clear Cache / Reset */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={handleClearData}
              style={{ color: 'var(--accent-rose)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={14} />
              <span>Clear Local History & Storage</span>
            </button>

            <button
              className="btn-action-primary"
              onClick={handleSave}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
