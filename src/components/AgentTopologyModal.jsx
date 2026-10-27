import React, { useEffect, useState } from 'react';
import {
  X,
  Layers,
  Cpu,
  Shield,
  Send,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { fetchAgentTopology } from '../services/api';

export default function AgentTopologyModal() {
  const { isTopologyOpen, setIsTopologyOpen } = useChat();
  const [topology, setTopology] = useState(null);

  useEffect(() => {
    if (isTopologyOpen) {
      fetchAgentTopology().then(setTopology);
    }
  }, [isTopologyOpen]);

  if (!isTopologyOpen) return null;

  const agentIcons = {
    request_handler_agent: <Layers size={18} color="var(--accent-cyan)" />,
    account_transaction_agent: <Send size={18} color="var(--accent-emerald)" />,
    card_security_agent: <Shield size={18} color="var(--accent-rose)" />,
    advisory_support_agent: <HelpCircle size={18} color="var(--accent-amber)" />,
  };

  return (
    <div className="modal-overlay" onClick={() => setIsTopologyOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Layers size={20} color="var(--accent-cyan)" />
            <span>Enterprise Multi-Agent Banking Topology</span>
          </div>
          <button className="btn-ghost" onClick={() => setIsTopologyOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            The AegisBank architecture is built on a hierarchical multi-agent framework. The front-line <strong>Request Handler Agent (Agent 1)</strong> inspects domain safety, normalizes user intent, extracts entities, and routes tasks to specialized downstream agents.
          </div>

          {/* Central Architecture Roadmap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topology?.agents?.map((agent) => {
              const isActive = agent.status === 'ACTIVE';
              return (
                <div key={agent.id} className={`agent-node-card ${isActive ? 'active' : ''}`}>
                  <div className="agent-node-header">
                    <div className="agent-node-name">
                      {agentIcons[agent.id] || <Cpu size={18} />}
                      <span>{agent.id.replace(/_/g, ' ').toUpperCase()}</span>
                    </div>
                    <span className={`agent-status-tag ${isActive ? 'active' : 'planned'}`}>
                      {isActive ? '● LIVE & ACTIVE' : '○ ROADMAP'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '4px 0 2px' }}>
                    {agent.role}
                  </p>

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Framework: <code>{agent.implementation || agent.target_framework}</code>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technical Specifications */}
          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--accent-cyan)" />
              <span>Technical Infrastructure</span>
            </div>
            <div>• Core Framework: <strong>Microsoft Agent Framework</strong> (`agent-framework`)</div>
            <div>• Backend Runtime: <strong>FastAPI / Python 3.14 (AsyncIO)</strong></div>
            <div>• Cloud Ready: <strong>Azure Web App & Azure OpenAI Managed Identity</strong></div>
            <div>• Local Mode: Built-in <strong>Intelligent Heuristic Fallback Engine</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
