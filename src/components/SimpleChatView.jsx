import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  RotateCcw,
  Sun,
  Moon,
  Mic,
  MicOff,
  Copy,
  Check,
  Cpu,
  Clock,
  SlidersHorizontal,
  Layers,
  LayoutDashboard,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function SimpleChatView() {
  const {
    messages,
    isLoading,
    sendMessage,
    startNewChat,
    theme,
    toggleTheme,
    healthInfo,
    setIsSettingsOpen,
    setIsTopologyOpen,
    setViewMode,
  } = useChat();

  const [inputVal, setInputVal] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const scrollEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputVal]);

  const handleSend = () => {
    if (!inputVal.trim() || isLoading) return;
    sendMessage(inputVal);
    setInputVal('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setInputVal('Can I check my current account balance?');
        setIsListening(false);
      }, 1500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="simple-chat-layout">
      {/* Top Header */}
      <header className="simple-header">
        <div className="simple-header-left">
          <div className="simple-bot-avatar-header">
            <Bot size={22} />
            <span className={`simple-online-pulse ${healthInfo?.healthy ? 'healthy' : 'offline'}`} />
          </div>
          <div className="simple-header-info">
            <div className="simple-header-title-row">
              <h1 className="simple-header-title">Banking Chatbot</h1>
              <span className={`simple-status-badge ${healthInfo?.healthy ? 'healthy' : 'offline'}`}>
                {healthInfo?.healthy ? 'Request Handler Agent (Online)' : 'Backend Offline'}
              </span>
            </div>
            <p className="simple-header-subtitle">
              Connected to FastAPI Backend • Agent 1 of 4
            </p>
          </div>
        </div>

        <div className="simple-header-right">
          {/* Multi-Agent Architecture Topology */}
          <button
            className="simple-btn-icon"
            onClick={() => setIsTopologyOpen(true)}
            title="View Multi-Agent Ecosystem Architecture"
          >
            <Layers size={17} />
          </button>

          {/* Connection & Backend Settings */}
          <button
            className="simple-btn-icon"
            onClick={() => setIsSettingsOpen(true)}
            title="Connection & Backend Settings"
          >
            <SlidersHorizontal size={17} />
          </button>

          {/* Reset / New Chat */}
          <button
            className="simple-btn-icon"
            onClick={startNewChat}
            title="Start new conversation"
          >
            <RotateCcw size={17} />
          </button>

          {/* Theme Toggle */}
          <button
            className="simple-btn-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Switch to Advanced Workbench */}
          <button
            className="simple-btn-icon"
            onClick={() => setViewMode('advanced')}
            title="Switch to Advanced Agent Workbench"
            style={{
              color: 'var(--accent-cyan)',
              marginLeft: '4px',
            }}
          >
            <LayoutDashboard size={17} />
          </button>
        </div>
      </header>

      {/* Main Chat Stream Area */}
      <div className="simple-chat-stream-wrapper">
        <div className="simple-chat-stream">
          {messages.length === 0 ? (
            /* Clean Minimalist Welcome Screen (No Option Cards) */
            <div className="simple-welcome-card">
              <div className="simple-welcome-icon-glow">
                <Bot size={40} />
              </div>
              <h2 className="simple-welcome-heading">Request Handler Agent</h2>
              <p className="simple-welcome-sub">
                Ask any banking or general question to test your backend Request Handler Agent.
              </p>
            </div>
          ) : (
            /* Message Stream */
            <div className="simple-messages-list">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const agentData = msg.data;

                return (
                  <div
                    key={msg.id}
                    className={`simple-message-row ${isUser ? 'user-side' : 'bot-side'}`}
                  >
                    {!isUser && (
                      <div className="simple-bot-avatar">
                        <Bot size={18} />
                      </div>
                    )}

                    <div className="simple-message-wrapper">
                      <div
                        className={`simple-bubble ${
                          isUser ? 'user-bubble' : 'bot-bubble'
                        } ${msg.isError ? 'error-bubble' : ''}`}
                      >
                        <div className="simple-bubble-text" style={{ whiteSpace: 'pre-wrap' }}>
                          {msg.text}
                        </div>
                      </div>

                      {/* Agent 1 Diagnostics Badge - shows how your backend agent processed this query */}
                      {!isUser && agentData && (
                        <div className="simple-agent-triage-pill">
                          <span className="agent-pill-item">
                            <Cpu size={11} />
                            <span>
                              {agentData.is_banking_related ? 'Banking Query' : 'Non-Banking Query'}
                            </span>
                          </span>
                          {agentData.category && (
                            <>
                              <span className="agent-pill-sep">•</span>
                              <span className="agent-pill-item">
                                Category: <strong>{agentData.category}</strong>
                              </span>
                            </>
                          )}
                          {agentData.recommended_agent && (
                            <>
                              <span className="agent-pill-sep">•</span>
                              <span className="agent-pill-item">
                                Route: <strong>{agentData.recommended_agent}</strong>
                              </span>
                            </>
                          )}
                          {agentData.reranked_documents?.length > 0 && (
                            <>
                              <span className="agent-pill-sep">•</span>
                              <span className="agent-pill-item">
                                RAG Context: <strong>{agentData.reranked_documents[0]}</strong>
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Bubble Metadata */}
                      <div className="simple-message-meta">
                        <span className="simple-time">{msg.timestamp}</span>

                        {!isUser && msg.processingTimeMs && (
                          <>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                              <Clock size={10} />
                              <span>{msg.processingTimeMs}ms</span>
                            </span>
                          </>
                        )}

                        {!isUser && (
                          <button
                            className="simple-meta-btn"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check size={12} className="text-emerald" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="simple-user-avatar">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Animation */}
              {isLoading && (
                <div className="simple-message-row bot-side">
                  <div className="simple-bot-avatar">
                    <Bot size={18} />
                  </div>
                  <div className="simple-message-wrapper">
                    <div className="simple-bubble bot-bubble typing-bubble">
                      <div className="simple-typing-dots">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                      <span className="simple-typing-label">Request Handler Agent is processing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={scrollEndRef} style={{ height: '8px' }} />
        </div>
      </div>

      {/* Bottom Input Area */}
      <footer className="simple-input-container">
        <div className="simple-input-box-wrapper">
          <textarea
            ref={textareaRef}
            className="simple-input-textarea"
            rows={1}
            placeholder="Ask your Request Handler Agent a question..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoFocus
          />

          <div className="simple-input-actions">
            {/* Voice Simulation */}
            <button
              className={`simple-btn-icon-sm ${isListening ? 'active-listening' : ''}`}
              onClick={toggleMic}
              title={isListening ? 'Listening...' : 'Simulate voice input'}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            {/* Send Button */}
            <button
              className="simple-btn-send"
              onClick={handleSend}
              disabled={!inputVal.trim() || isLoading}
              title="Send to Backend (Enter)"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        <div className="simple-input-footer-note">
          <span>Press <strong>Enter</strong> to send directly to backend agent</span>
        </div>
      </footer>
    </div>
  );
}
