import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { MessageBubble, ThinkingIndicator } from './ChatMessages';
import ChatInputBar from './ChatInputBar';
import VibeTypebar from './VibeTypebar';

import './styles.css';

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
  const { messages, isThinking, sendMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = useCallback(
    (msg: { role: 'user'; content: string }) => {
      void sendMessage(msg.content);
    },
    [sendMessage],
  );

  return (
    <div className="chat-home-scope">
      <div className="app-root min-h-screen bg-black text-white flex flex-col font-sans">
        <div className="noise-bg" />
        <div className="dot-grid" />

        <AnimatePresence mode="wait">
          {hasMessages ? (
            <motion.div
              key="conversation"
              className="flex flex-col h-screen w-full relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex-1 overflow-y-auto px-4 pt-20">
                <div className="max-w-3xl mx-auto">
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} />
                  ))}
                  {isThinking && <ThinkingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="px-4 pb-6">
                <div className="max-w-3xl mx-auto">
                  <ChatInputBar
                    placeholder="Make updates to your app..."
                    onSend={handleSend}
                    status={isThinking ? 'streaming' : 'ready'}
                    disabled={isThinking}
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              className="absolute inset-0 z-10"
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
