import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function InputBar() {
  const {
    sendMessage,
    isLoading,
    suggestions,
    startNewChat,
    currentProfile,
  } = useChat();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
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

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate speech recognition transcription for demo
      setTimeout(() => {
        setInputVal('Can you check my checking balance and statement for this month?');
        setIsListening(false);
      }, 1800);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="chat-input-area">
      {/* Dynamic Suggested Follow-ups */}
      {suggestions.length > 0 && (
        <div className="followups-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <Sparkles size={12} color="var(--accent-cyan)" />
            <span>Suggestions:</span>
          </div>
          {suggestions.slice(0, 3).map((item, idx) => (
            <button
              key={idx}
              className="followup-pill"
              onClick={() => sendMessage(item)}
            >
              <span>{item}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Input Box */}
      <div className="input-box-wrapper">
        <textarea
          ref={textareaRef}
          className="input-textarea"
          rows={1}
          placeholder={`Message AegisBank AI as ${currentProfile.name} (e.g. 'Transfer $100 to Bob', 'Freeze my card')...`}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <div className="input-bottom-bar">
          {/* Action Chips */}
          <div className="input-tools">
            <button
              className="tool-chip-btn"
              onClick={() => setInputVal('Transfer $100 to ')}
              title="Preset transfer instruction"
            >
              <span>💸 Send Money</span>
            </button>
            <button
              className="tool-chip-btn"
              onClick={() => setInputVal('What is my checking account balance?')}
              title="Check balance"
            >
              <span>📊 Balance</span>
            </button>
            <button
              className="tool-chip-btn"
              onClick={() => setInputVal(`Freeze my card ending in ${currentProfile.activeCard.replace('•••• ', '')}`)}
              title="Lock card"
            >
              <span>🛡️ Freeze Card</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Clear Chat Button */}
            <button
              className="btn-ghost"
              style={{ padding: '6px 8px' }}
              onClick={startNewChat}
              title="Reset conversation"
            >
              <RotateCcw size={15} />
            </button>

            {/* Voice Dictation Simulation */}
            <button
              className={`btn-ghost ${isListening ? 'active' : ''}`}
              style={{
                padding: '6px 8px',
                color: isListening ? 'var(--accent-rose)' : 'inherit',
                borderColor: isListening ? 'var(--accent-rose)' : 'var(--border-subtle)',
              }}
              onClick={toggleMic}
              title={isListening ? 'Listening...' : 'Simulate voice prompt'}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            {/* Send Button */}
            <button
              className="btn-send"
              onClick={handleSend}
              disabled={!inputVal.trim() || isLoading}
              title="Send message (Enter)"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
