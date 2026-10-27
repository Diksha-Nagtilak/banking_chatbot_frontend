import React from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Send,
  ShieldAlert,
  Wallet,
  Home,
  HelpCircle,
  UtensilsCrossed,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function Sidebar() {
  const {
    isSidebarOpen,
    startNewChat,
    currentProfile,
    sessions,
    activeSessionId,
    selectSession,
    deleteSession,
    sendMessage,
  } = useChat();

  const quickPrompts = [
    {
      icon: <ShieldAlert size={14} color="#f43f5e" />,
      label: 'Emergency Card Freeze',
      prompt: `Emergency! I lost my card ending in ${currentProfile.activeCard.replace('•••• ', '')}, please freeze it immediately!`,
      isEmergency: true,
    },
    {
      icon: <Send size={14} color="#38bdf8" />,
      label: 'Quick Transfer $250',
      prompt: 'Please transfer $250 to mom from my checking account',
    },
    {
      icon: <Wallet size={14} color="#10b981" />,
      label: 'Check Balance',
      prompt: 'What is my current checking account balance?',
    },
    {
      icon: <Home size={14} color="#f59e0b" />,
      label: 'Mortgage & Loans Inquiry',
      prompt: 'What are current 30-year fixed mortgage rates and eligibility requirements?',
    },
    {
      icon: <HelpCircle size={14} color="#818cf8" />,
      label: 'Branch Hours & SWIFT',
      prompt: 'What are the main branch customer service hours and international SWIFT code?',
    },
    {
      icon: <UtensilsCrossed size={14} color="#94a3b8" />,
      label: 'Test Domain Refusal (Pizza)',
      prompt: 'Can you give me a good recipe for homemade pepperoni pizza?',
    },
  ];

  return (
    <aside className={`app-sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header">
        {/* New Chat Button */}
        <button className="btn-new-chat" onClick={startNewChat}>
          <Plus size={16} />
          <span>New Banking Chat</span>
        </button>

        {/* Live Customer Account Snapshot */}
        <div className="account-preview-card">
          <div className="account-preview-header">
            <span>Primary Account</span>
            <span className="account-type-badge">{currentProfile.accountType}</span>
          </div>
          <div className="account-balance-amount">
            ${currentProfile.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>Acct: {currentProfile.accountNumber}</span>
            <span>Card: {currentProfile.activeCard}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Presets */}
      <div className="sidebar-section-title">
        <span>Quick Scenarios</span>
      </div>
      <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            className={`quick-prompt-btn ${item.isEmergency ? 'emergency' : ''}`}
            onClick={() => sendMessage(item.prompt)}
          >
            <div style={{ marginTop: '2px' }}>{item.icon}</div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontWeight: 600, color: item.isEmergency ? '#fda4af' : 'var(--text-primary)' }}>
                {item.label}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {item.prompt}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="sidebar-section-title" style={{ marginTop: '12px' }}>
        <span>Conversations ({sessions.length})</span>
      </div>
      <div className="sidebar-scroll">
        {sessions.length === 0 ? (
          <div style={{ padding: '16px 8px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            No previous conversations. Start a new chat above!
          </div>
        ) : (
          sessions.map((sess) => (
            <div
              key={sess.id}
              className={`history-item ${sess.id === activeSessionId ? 'active' : ''}`}
              onClick={() => selectSession(sess.id)}
            >
              <div className="history-item-content">
                <MessageSquare size={14} />
                <span className="history-item-title">{sess.title || 'Banking Conversation'}</span>
              </div>
              <button
                className="history-item-delete"
                onClick={(e) => deleteSession(e, sess.id)}
                title="Delete conversation"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">{currentProfile.name[0]}</div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.75rem' }}>
              {currentProfile.name}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {currentProfile.tier}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
