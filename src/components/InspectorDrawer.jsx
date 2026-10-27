import React, { useState } from 'react';
import {
  X,
  Binary,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function InspectorDrawer() {
  const { isInspectorOpen, setIsInspectorOpen, inspectedMessage, currentProfile } = useChat();
  const [copied, setCopied] = useState(false);

  if (!isInspectorOpen) return null;

  const data = inspectedMessage?.data;
  const isBanking = data?.is_banking_related;

  const handleCopyJson = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className={`inspector-drawer ${isInspectorOpen ? '' : 'collapsed'}`}>
      <div className="inspector-header">
        <div className="inspector-title">
          <Binary size={18} color="var(--accent-cyan)" />
          <span>Agent Intelligence Inspector</span>
        </div>
        <button
          className="btn-ghost"
          style={{ padding: '4px 6px' }}
          onClick={() => setIsInspectorOpen(false)}
          title="Close inspector"
        >
          <X size={16} />
        </button>
      </div>

      <div className="inspector-scroll">
        {/* Pipeline Execution Flow */}
        <div className="pipeline-diagram">
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            4-Agent Multi-Tier Pipeline Flow
          </div>

          <div className="pipeline-step active">
            <div className="pipeline-step-badge">1</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600 }}>Triage & Ingestion Gateway</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Session: {inspectedMessage?.sessionId || 'Active'}
              </span>
            </div>
          </div>

          <div className="pipeline-step active">
            <div className="pipeline-step-badge">2</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600 }}>Domain Boundary Classifier</span>
              <span style={{ fontSize: '0.68rem', color: isBanking ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {data ? (isBanking ? `Banking Domain (${(data.confidence * 100).toFixed(0)}% Conf)` : 'Non-Banking Refusal') : 'Awaiting prompt'}
              </span>
            </div>
          </div>

          <div className={`pipeline-step ${data?.entities ? 'active' : ''}`}>
            <div className="pipeline-step-badge">3</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600 }}>Entity Extraction & Normalization</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {data?.entities ? `${data.category || 'General'} • ${data.detected_intent || 'Intent'}` : 'Pending'}
              </span>
            </div>
          </div>

          <div className={`pipeline-step ${data?.enriched_query ? 'active' : ''}`}>
            <div className="pipeline-step-badge">4</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600 }}>Semantic Query Enrichment</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Standardized downstream prompt synthesized
              </span>
            </div>
          </div>

          <div className={`pipeline-step ${data?.recommended_agent ? 'active' : ''}`}>
            <div className="pipeline-step-badge">5</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600 }}>Downstream Agent Routing</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>
                {data?.recommended_agent ? data.recommended_agent.replace(/_/g, ' ').toUpperCase() : 'None / Gateway Finished'}
              </span>
            </div>
          </div>
        </div>

        {/* Enriched Query Output */}
        {data?.enriched_query && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Synthesized Enriched Query
            </span>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#38bdf8',
                lineHeight: 1.45,
              }}
            >
              {data.enriched_query}
            </div>
          </div>
        )}

        {/* Raw JSON Inspector */}
        <div className="json-inspector-box">
          <div className="json-header">
            <span>Agent Output Payload</span>
            <button
              onClick={handleCopyJson}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: copied ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                fontSize: '0.7rem',
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="json-code">
            {data ? JSON.stringify(data, null, 2) : '// No message inspected yet.\n// Click "Inspect JSON" on any assistant message.'}
          </pre>
        </div>

        {/* Customer Context Snapshot */}
        <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)' }}>
            <Info size={14} color="var(--accent-cyan)" />
            <span>Active Session Context</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Customer: <strong>{currentProfile.name}</strong> ({currentProfile.tier})<br />
            Primary Checking: {currentProfile.accountNumber} ($
            {currentProfile.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})<br />
            Active Debit Card: {currentProfile.activeCard}
          </div>
        </div>
      </div>
    </aside>
  );
}
