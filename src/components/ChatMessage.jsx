import React, { useState } from 'react';
import {
  User,
  Bot,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Cpu,
  Clock,
  Code2,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ActionCard from './ActionCard';

export default function ChatMessage({ message }) {
  const { setInspectedMessage, setIsInspectorOpen } = useChat();
  const [showEnriched, setShowEnriched] = useState(false);

  const isUser = message.sender === 'user';
  const data = message.data;

  const handleInspect = () => {
    setInspectedMessage(message);
    setIsInspectorOpen(true);
  };

  const getAgentLabel = (agentKey) => {
    switch (agentKey) {
      case 'account_transaction_agent':
        return 'Account & Transaction Agent';
      case 'card_security_agent':
        return 'Cards & Security Agent';
      case 'advisory_support_agent':
        return 'Advisory & Support Agent';
      case 'request_handler_agent':
        return 'Request Handler Agent';
      default:
        return 'Pending Dispatch';
    }
  };

  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? 'user' : 'bot'}`}>
        {isUser ? <User size={16} /> : <Bot size={18} />}
      </div>

      <div className="message-content-wrapper">
        {/* Message Bubble */}
        <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
          {/* Bot Metadata & Badges */}
          {!isUser && data && (
            <div className="agent-pills-rack">
              {/* Domain validation */}
              {data.is_banking_related ? (
                <span className="agent-badge verified">
                  <ShieldCheck size={12} />
                  <span>Verified Banking ({(data.confidence * 100).toFixed(0)}%)</span>
                </span>
              ) : (
                <span className="agent-badge rejected">
                  <ShieldAlert size={12} />
                  <span>Non-Banking Query</span>
                </span>
              )}

              {/* Recommended Downstream Agent */}
              {data.recommended_agent && (
                <span className="agent-badge routed">
                  <Cpu size={12} />
                  <span>Routed: {getAgentLabel(data.recommended_agent)}</span>
                </span>
              )}

              {/* Urgency Pill if Critical */}
              {data.entities?.urgency === 'critical' && (
                <span className="agent-badge urgency-critical">
                  <span>🚨 CRITICAL URGENCY</span>
                </span>
              )}
            </div>
          )}

          {/* Conversational Text */}
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.text}
          </div>

          {/* Entities Rack (if banking related) */}
          {!isUser && data?.is_banking_related && (
            <div className="entities-summary-card">
              <div className="entities-summary-title">
                <span>Extracted Parameters</span>
                <button
                  onClick={handleInspect}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                  }}
                  title="View complete payload in developer inspector"
                >
                  <Code2 size={12} />
                  <span>Inspect JSON</span>
                </button>
              </div>

              <div className="entities-tags-row">
                <span className="entity-chip">
                  <span className="entity-chip-label">Category:</span>
                  <span className="entity-chip-val">{data.category.replace('_', ' ')}</span>
                </span>

                {data.detected_intent && (
                  <span className="entity-chip">
                    <span className="entity-chip-label">Intent:</span>
                    <span className="entity-chip-val">{data.detected_intent}</span>
                  </span>
                )}

                {data.entities?.amount && (
                  <span className="entity-chip">
                    <span className="entity-chip-label">Amount:</span>
                    <span className="entity-chip-val" style={{ color: 'var(--accent-cyan)' }}>
                      ${data.entities.amount} {data.entities.currency || 'USD'}
                    </span>
                  </span>
                )}

                {data.entities?.recipient && (
                  <span className="entity-chip">
                    <span className="entity-chip-label">Recipient:</span>
                    <span className="entity-chip-val">{data.entities.recipient}</span>
                  </span>
                )}

                {data.entities?.card_last_four && (
                  <span className="entity-chip">
                    <span className="entity-chip-label">Card:</span>
                    <span className="entity-chip-val">•••• {data.entities.card_last_four}</span>
                  </span>
                )}

                {data.entities?.account_type && (
                  <span className="entity-chip">
                    <span className="entity-chip-label">Account:</span>
                    <span className="entity-chip-val">{data.entities.account_type}</span>
                  </span>
                )}

                {data.missing_information?.length > 0 && (
                  <span className="entity-chip" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
                    <span className="entity-chip-label" style={{ color: 'var(--accent-amber)' }}>Missing:</span>
                    <span className="entity-chip-val" style={{ color: 'var(--accent-amber)' }}>
                      {data.missing_information.join(', ')}
                    </span>
                  </span>
                )}
              </div>

              {/* Collapsible Enriched Query */}
              {data.enriched_query && (
                <div className="enriched-accordion">
                  <button
                    className="enriched-toggle-btn"
                    onClick={() => setShowEnriched(!showEnriched)}
                  >
                    <span>Enriched Gateway Query</span>
                    {showEnriched ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {showEnriched && (
                    <div className="enriched-content-box">
                      {data.enriched_query}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Interactive Action Card */}
          {!isUser && <ActionCard message={message} />}
        </div>

        {/* Message Timestamp & Processing Latency */}
        <div className="message-meta-row">
          <span>{message.timestamp}</span>
          {!isUser && message.processingTimeMs && (
            <>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={11} />
                <span>{message.processingTimeMs}ms</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
