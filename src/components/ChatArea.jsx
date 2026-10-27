import React, { useRef, useEffect } from 'react';
import {
  Landmark,
  ShieldCheck,
  Send,
  CreditCard,
  Wallet,
  Home,
  Bot,
  AlertCircle,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';

export default function ChatArea() {
  const { messages, isLoading, sendMessage, currentProfile, errorMessage } = useChat();
  const scrollEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-messages-container">
      {messages.length === 0 ? (
        /* Welcome Hero View */
        <div className="welcome-hero">
          <div className="welcome-icon-ring">
            <Landmark size={32} />
          </div>

          <h1 className="welcome-title">AegisBank Intelligence</h1>
          <p className="welcome-subtitle">
            Welcome, <strong>{currentProfile.name}</strong>. I am your next-generation banking assistant powered by the Microsoft Agent Framework. I triage, enrich, and route your inquiries securely across our multi-agent banking ecosystem.
          </p>

          {/* Category Feature Cards */}
          <div className="welcome-cards-grid">
            <div
              className="welcome-card"
              onClick={() => sendMessage('Please transfer $200 to Sarah for dinner from checking')}
            >
              <div className="welcome-card-header">
                <Send size={16} />
                <span>Funds Transfer</span>
              </div>
              <p className="welcome-card-desc">
                Domestic wire, ACH, and instant peer transfers with automatic parameter validation.
              </p>
            </div>

            <div
              className="welcome-card"
              onClick={() => sendMessage('Can you show my current checking and savings account balance?')}
            >
              <div className="welcome-card-header">
                <Wallet size={16} />
                <span>Account Services</span>
              </div>
              <p className="welcome-card-desc">
                Real-time balance inquiries, monthly statements, transaction histories, and deposits.
              </p>
            </div>

            <div
              className="welcome-card"
              onClick={() => sendMessage(`Emergency! I lost my debit card ending in ${currentProfile.activeCard.replace('•••• ', '')} please lock it!`)}
            >
              <div className="welcome-card-header" style={{ color: 'var(--accent-rose)' }}>
                <CreditCard size={16} />
                <span>Cards & Security</span>
              </div>
              <p className="welcome-card-desc">
                Instant card freezing, PIN resets, suspicious charge reporting with critical priority.
              </p>
            </div>

            <div
              className="welcome-card"
              onClick={() => sendMessage('What are your 30-year mortgage rates and personal loan options?')}
            >
              <div className="welcome-card-header" style={{ color: 'var(--accent-amber)' }}>
                <Home size={16} />
                <span>Loans & Advisory</span>
              </div>
              <p className="welcome-card-desc">
                Home mortgages, personal loans, APR rates, and banking policies consultation.
              </p>
            </div>
          </div>

          <div className="welcome-security-banner">
            <ShieldCheck size={16} />
            <span>Bank-Grade 256-Bit Domain Verification & Microsoft Agent Framework Routing</span>
          </div>
        </div>
      ) : (
        /* Conversation Messages */
        <>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="typing-row">
              <div className="message-avatar bot">
                <Bot size={18} />
              </div>
              <div className="typing-bubble">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
        </>
      )}

      {/* Error alert banner if any */}
      {errorMessage && (
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--accent-rose)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.8rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div ref={scrollEndRef} style={{ height: '4px' }} />
    </div>
  );
}
