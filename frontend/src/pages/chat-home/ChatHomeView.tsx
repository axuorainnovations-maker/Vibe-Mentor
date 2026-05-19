import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { PanelLeft, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { MessageBubble, ThinkingIndicator } from './ChatMessages';
import ChatInputBar from './ChatInputBar';
import VibeTypebar from './VibeTypebar';

import './styles.css';

function ContextRingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <circle
        cx="9"
        cy="9"
        r="7"
        fill="none"
        stroke="#34C759"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="33 44"
        transform="rotate(-90 9 9)"
      />
    </svg>
  );
}

function Cloud3Icon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2 }}
        d="M7 18H17C19.2 18 21 16.2 21 14C21 11.8 19.2 10 17 10H16.7C16 7.7 13.9 6 11.5 6C8.7 6 6.4 8.2 6.1 11C4.3 11.3 3 12.8 3 14.6C3 16.5 4.5 18 6.4 18H7Z"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <motion.circle
        cx="10"
        cy="14"
        r="1"
        fill="white"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <motion.circle
        cx="13"
        cy="14"
        r="1"
        fill="white"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <motion.circle
        cx="16"
        cy="14"
        r="1"
        fill="white"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
      />
    </svg>
  );
}

function SidebarLogo() {
  return (
    <div className="w-[31px] h-[31px] rounded-[9px] bg-[#1a1a1a] border border-white/[0.06] flex items-center justify-center">
      <div style={{ transform: 'scale(0.6)', opacity: 0.9 }}>
        <Cloud3Icon />
      </div>
    </div>
  );
}

function SidebarIcon() {
  return <div className="w-[30px] h-[30px] rounded-[10px] hover:bg-white/[0.045] transition-all duration-150" />;
}

function EmptyLanding({
  onSend,
  isThinking,
}: {
  onSend: (content: string) => void;
  isThinking: boolean;
}) {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    onSend(trimmed);
    setInput('');
  }, [input, isThinking, onSend]);

  return (
    <div className="flex h-full w-full" style={{ background: '#0b0b0c' }}>
      <aside
        className="w-[58px] flex flex-col items-center py-3 relative"
        style={{ background: '#101011', borderRight: '1px solid rgba(255,255,255,0.045)' }}
      >
        <SidebarLogo />
        <div className="mt-8 flex flex-col gap-[22px] text-white/56">
          <SidebarIcon />
          <SidebarIcon />
          <SidebarIcon />
        </div>
        <div className="absolute bottom-4">
          <SidebarIcon />
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center" style={{ paddingTop: '200px', background: '#0b0b0c' }}>
        <div className="relative">
          <div className="absolute inset-0 bg-white/[0.035] blur-3xl rounded-full scale-[2]" />
          <div className="relative flex items-center justify-center">
            <div className="relative z-10 scale-[1.55]">
              <Cloud3Icon />
            </div>
          </div>
        </div>

        <motion.h1
          className="mt-[28px] text-center"
          style={{
            fontSize: '38px',
            lineHeight: '0.98',
            letterSpacing: '-0.07em',
            fontWeight: 700,
            color: '#f5f5f5',
            maxWidth: '620px',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        >
          What do you want to create today?
        </motion.h1>

        <div className="mt-[42px]">
          <VibeTypebar
            variant="hero"
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            placeholder="Describe what you want to create or learn..."
            disabled={isThinking}
            isStreaming={isThinking}
          />
        </div>

        <div className="mt-[38px] flex items-center gap-3 text-[12px] text-white/42 font-[500]">
          <span className="font-[800] italic text-white">MAX</span>
          <div className="w-px h-4 bg-white/12" />
          <span>Ultra coding agent with its own browser</span>
          <div className="px-[8px] py-[2px] rounded-[7px] bg-white text-black text-[11px] font-[700]">New</div>
        </div>
      </main>
    </div>
  );
}

export default function ChatHomeView() {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { messages, isThinking, sendMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleLogout = () => {
    void signOut()
      .then(() => navigate('/login', { replace: true }))
      .catch(() => navigate('/login', { replace: true }));
  };

  const handleSend = useCallback(
    (msg: { role: 'user'; content: string }) => {
      void sendMessage(msg.content);
    },
    [sendMessage],
  );

  return (
    <div className="chat-home-scope">
      <div className="app-root">
        <div className="noise-bg" />
        <div className="dot-grid" />

        <AnimatePresence mode="wait">
          {hasMessages ? (
            <motion.div
              key="conversation"
              className="dashboard-page visible"
              style={{ flexDirection: 'column' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <header className="dashboard-top-chrome">
                <button type="button" className="dash-icon-btn" aria-label="Toggle sidebar">
                  <PanelLeft size={18} strokeWidth={1.75} />
                </button>
                <div className="dash-top-right">
                  <button type="button" className="dash-context-pill">
                    <span className="dash-context-ring">
                      <ContextRingIcon />
                    </span>
                    Context
                  </button>
                  <button type="button" className="dash-icon-btn" aria-label="Notifications">
                    <Bell size={17} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    className="dash-avatar"
                    onClick={handleLogout}
                    aria-label="Log out"
                    title="Log out"
                  >
                    <span className="sr-only">Log out</span>
                  </button>
                </div>
              </header>

              <div className="dashboard-scroll-body" style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  className="dashboard-inner"
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    paddingTop: '24px',
                  }}
                >
                  <div
                    className="messages-container"
                    style={{
                      flex: 1,
                      overflow: 'auto',
                      padding: '0 24px',
                      maxWidth: '720px',
                      margin: '0 auto',
                      width: '100%',
                    }}
                  >
                    {messages.map((msg, i) => (
                      <MessageBubble key={i} message={msg} />
                    ))}
                    {isThinking && <ThinkingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>
                  <div style={{ padding: '16px 24px 24px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
                    <ChatInputBar
                      placeholder="Send a message..."
                      onSend={handleSend}
                      status={isThinking ? 'streaming' : 'ready'}
                      disabled={isThinking}
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              className="dashboard-page visible"
              style={{ padding: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <EmptyLanding onSend={(content) => void sendMessage(content)} isThinking={isThinking} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
