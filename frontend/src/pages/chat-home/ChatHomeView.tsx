import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { MessageBubble } from './ChatMessages';
import { AgentMessage } from './AgentMessage';
import VibeTypebar from './VibeTypebar';
import VibeMentorSidebar from './VibeMentorSidebar';

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
    <div className="flex h-full w-full" style={{ background: '#000' }}>
      <VibeMentorSidebar />

      <main className="flex-1 flex flex-col items-center" style={{ paddingTop: '200px', background: '#000' }}>
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
  const { messages, sendMessage } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;
  const last = messages[messages.length - 1];
  const isThinking = last?.role === 'assistant' && !last.content;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = useCallback(
    (msg: { role: 'user'; content: string }) => {
      void sendMessage(msg.content);
    },
    [sendMessage],
  );

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    void sendMessage(trimmed);
    setInput('');
  }, [input, isThinking, sendMessage]);

  return (
    <div className="chat-home-scope">
      <div className="app-root min-h-screen bg-black text-white flex flex-col font-sans">


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
              {/* Top header */}
              <header
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '68px',
                  background: 'transparent',
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '26px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", system-ui, sans-serif',
                    fontSize: '17px',
                    fontWeight: 400,
                    lineHeight: 1,
                    color: '#e8e8e8',
                    letterSpacing: '0.15px',
                  }}
                >
                  Hello
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto" style={{ padding: '60px 24px 24px' }}>
                <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                  {messages.map((msg, i) =>
                    msg.role === 'user' ? (
                      <MessageBubble key={i} message={msg} />
                    ) : (
                      <AgentMessage key={i} message={msg} />
                    ),
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div style={{ padding: '12px 24px 28px', display: 'flex', justifyContent: 'center' }}>
                <VibeTypebar
                  variant="compact"
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  placeholder="Make updates to your app..."
                  disabled={isThinking}
                  isStreaming={isThinking}
                />
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
