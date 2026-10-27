import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { checkBackendHealth, sendChatMessage, getApiBaseUrl } from '../services/api';
import { CUSTOMER_PROFILES } from './customerProfiles';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('aegis_theme') || 'dark');

  // Customer Profile State
  const [currentProfile, setCurrentProfile] = useState(CUSTOMER_PROFILES[0]);

  // Sidebar & Inspector toggles
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inspectedMessage, setInspectedMessage] = useState(null);

  // Modals
  const [isTopologyOpen, setIsTopologyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Backend Health
  const [healthInfo, setHealthInfo] = useState({ healthy: false, loading: true });

  // Conversation Sessions
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('aegis_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return 'session_' + Math.random().toString(36).substring(2, 9);
  });

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Follow-up suggestions
  const [suggestions, setSuggestions] = useState([
    'Transfer $250 to mom from checking',
    'What is my current account balance?',
    'Emergency! Freeze my lost card ending in 4821',
    'What are current 30-year fixed mortgage rates?',
  ]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('aegis_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aegis_theme', theme);
  }, [theme]);

  // Poll backend health
  const refreshHealth = useCallback(async () => {
    const info = await checkBackendHealth();
    setHealthInfo(info);
    return info;
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    async function loadHealth() {
      const info = await checkBackendHealth();
      if (isSubscribed) {
        setHealthInfo(info);
      }
    }
    loadHealth();
    const interval = setInterval(loadHealth, 15000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  // Switch Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Start New Chat
  const startNewChat = () => {
    const newId = 'session_' + Math.random().toString(36).substring(2, 9);
    setActiveSessionId(newId);
    setMessages([]);
    setInspectedMessage(null);
    setErrorMessage(null);
    setSuggestions([
      'Transfer $250 to mom from checking',
      'What is my current account balance?',
      'Emergency! Freeze my lost card ending in 4821',
      'What are current 30-year fixed mortgage rates?',
    ]);
  };

  // Select existing session
  const selectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    const found = sessions.find(s => s.id === sessionId);
    if (found) {
      setMessages(found.messages || []);
      const lastBot = [...(found.messages || [])].reverse().find(m => m.sender === 'bot');
      if (lastBot) setInspectedMessage(lastBot);
    }
  };

  // Delete session
  const deleteSession = (e, sessionId) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      startNewChat();
    }
  };

  // Trigger celebration micro-animation
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#10b981', '#6366f1', '#f59e0b'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  // Execute interactive mock action (e.g. transfer money or lock card)
  const executeAction = (actionType, details, messageId) => {
    if (actionType === 'transfer') {
      const transferAmount = details.amount || 100;
      setCurrentProfile(prev => ({
        ...prev,
        balance: Math.max(0, prev.balance - transferAmount),
      }));
      triggerConfetti();

      // Mark the message action as executed
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            actionState: {
              completed: true,
              executedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              txId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
            },
          };
        }
        return m;
      }));
    } else if (actionType === 'lock_card') {
      triggerConfetti();
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            actionState: {
              completed: true,
              status: 'LOCKED',
              executedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              txId: 'SEC-' + Math.floor(100000 + Math.random() * 900000),
            },
          };
        }
        return m;
      }));
    }
  };

  // View Mode: 'simple' (clean chatbot UI) vs 'advanced' (developer multi-agent workbench)
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('aegis_view_mode') || 'simple');

  useEffect(() => {
    localStorage.setItem('aegis_view_mode', viewMode);
  }, [viewMode]);

  // Send message directly to Backend Request Handler Agent
  const sendMessage = async (userText) => {
    if (!userText || !userText.trim() || isLoading) return;

    const trimmed = userText.trim();
    const userMsgId = 'msg_' + Date.now();
    const userMessage = {
      id: userMsgId,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Direct call to Backend Request Handler Agent (Agent 1)
      const response = await sendChatMessage({
        message: trimmed,
        sessionId: activeSessionId,
        userId: currentProfile.id,
        channel: 'web',
        context: {
          customerName: currentProfile.name,
          accountNumber: currentProfile.accountNumber,
          checkingBalance: currentProfile.balance,
          activeCard: currentProfile.activeCard,
        },
      });

      // Directly use the backend Request Handler Agent's response message (no hardcoded answers!)
      const botResponseText =
        response?.data?.response_message || 'No response returned from Request Handler Agent.';

      const botMsgId = 'msg_bot_' + Date.now();
      const botMessage = {
        id: botMsgId,
        sender: 'bot',
        text: botResponseText,
        data: response.data,
        status: response.status,
        processingTimeMs: response.processing_time_ms,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updated = [...newMessages, botMessage];
      setMessages(updated);
      setInspectedMessage(botMessage);

      // Update sessions list in history
      setSessions(prev => {
        const title = trimmed.length > 32 ? trimmed.substring(0, 30) + '...' : trimmed;
        const existingIdx = prev.findIndex(s => s.id === activeSessionId);
        if (existingIdx >= 0) {
          const updatedSessions = [...prev];
          updatedSessions[existingIdx] = {
            ...updatedSessions[existingIdx],
            title: updatedSessions[existingIdx].title || title,
            updatedAt: Date.now(),
            messages: updated,
          };
          return updatedSessions;
        } else {
          return [
            {
              id: activeSessionId,
              title,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              messages: updated,
            },
            ...prev,
          ];
        }
      });
    } catch (err) {
      console.error('Chat error contacting backend:', err);
      const activeBase = getApiBaseUrl() || 'http://127.0.0.1:8000';
      const botMsgId = 'msg_err_' + Date.now();
      const errorBotMessage = {
        id: botMsgId,
        sender: 'bot',
        text: `⚠️ Could not reach backend: ${err.message}. Please verify the backend is running at "${activeBase}" (you can test or change this endpoint in Settings ⚙️).`,
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newMessages, errorBotMessage]);
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        theme,
        toggleTheme,
        viewMode,
        setViewMode,
        currentProfile,
        setCurrentProfile,
        isSidebarOpen,
        setIsSidebarOpen,
        isInspectorOpen,
        setIsInspectorOpen,
        inspectedMessage,
        setInspectedMessage,
        isTopologyOpen,
        setIsTopologyOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        healthInfo,
        refreshHealth,
        sessions,
        activeSessionId,
        selectSession,
        deleteSession,
        startNewChat,
        messages,
        isLoading,
        errorMessage,
        suggestions,
        sendMessage,
        executeAction,
        triggerConfetti,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

