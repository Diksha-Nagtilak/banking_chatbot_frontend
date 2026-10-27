import React from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputBar from './components/InputBar';
import InspectorDrawer from './components/InspectorDrawer';
import AgentTopologyModal from './components/AgentTopologyModal';
import SettingsModal from './components/SettingsModal';
import SimpleChatView from './components/SimpleChatView';

function BankingChatApp() {
  const { viewMode } = useChat();

  if (viewMode === 'simple') {
    return (
      <div className="app-container simple-mode-container">
        <SimpleChatView />
        <AgentTopologyModal />
        <SettingsModal />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Navigation & Status Bar */}
      <Header />

      {/* Main Responsive Body */}
      <div className="main-body">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Chat View */}
        <main className="chat-main-view">
          <ChatArea />
          <InputBar />
        </main>

        {/* Right Intelligence Inspector Drawer */}
        <InspectorDrawer />
      </div>

      {/* Architectural & Settings Modals */}
      <AgentTopologyModal />
      <SettingsModal />
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <BankingChatApp />
    </ChatProvider>
  );
}

