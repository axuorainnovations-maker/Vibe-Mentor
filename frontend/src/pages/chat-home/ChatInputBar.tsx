import { memo, useCallback, useEffect, useRef, useState } from 'react';

type UserMessage = { role: 'user'; content: string };

type ChatInputBarProps = {
  onSend?: (msg: UserMessage) => void;
  onStop?: () => void;
  status?: 'ready' | 'streaming' | 'submitted';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

const ChatInputBar = memo(function ChatInputBar({
  onSend,
  onStop,
  status = 'ready',
  placeholder = 'Make updates to your app...',
  disabled,
  autoFocus,
}: ChatInputBarProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isStreaming = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (!autoFocus) return;
    inputRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend?.({ role: 'user', content: trimmed });
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = '24px';
    }
  }, [input, isStreaming, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleInput = useCallback(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = '24px';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '560px',
        maxWidth: 'calc(100vw - 32px)',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)',
        border: '1px solid #2a2a2a',
        borderRadius: '20px',
        boxShadow: '0 -2px 20px rgba(0,0,0,0.5)',
        padding: '14px 16px 12px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 50,
      }}
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => { setInput(e.target.value); handleInput(); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        style={{
          width: '100%',
          height: '24px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          color: '#e5e5e5',
          fontSize: '15px',
          fontFamily: 'inherit',
          lineHeight: '24px',
          padding: 0,
          display: 'block',
        }}
      />
      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconButton>+</IconButton>
          <IconButton>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <path d="M21 17l-5-5-3 3-4-4-4 5" />
            </svg>
          </IconButton>
          <IconButton>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 4px)', gridTemplateRows: 'repeat(2, 4px)', gap: '2px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444', display: 'block' }} />
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b', display: 'block' }} />
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981', display: 'block' }} />
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3b82f6', display: 'block' }} />
            </div>
          </IconButton>
          <Pill label="Auto" />
          <Pill label="Default" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: '13px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#6e6e6e', fontWeight: 400 }}>Try</span>
            <span style={{ fontStyle: 'italic', fontWeight: 700, color: '#d4d4d4', letterSpacing: '0.3px' }}>MAX</span>
            <span style={{ color: '#6e6e6e', fontWeight: 400 }}>New</span>
          </div>
          <button
            onClick={() => {
              if (isStreaming) onStop?.();
              else if (input.trim()) handleSubmit();
            }}
            aria-label={isStreaming ? 'Stop' : 'Send'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f5f5f5',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        background: '#1e1e1e',
        border: '1px solid #2e2e2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7a7a7a',
        fontSize: '16px',
        lineHeight: 1,
        fontWeight: 400,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <div
      style={{
        background: '#1c1c1c',
        border: '1px solid #2c2c2c',
        borderRadius: '14px',
        padding: '5px 10px',
        fontSize: '13px',
        color: '#b5b5b5',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      <svg viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

export default ChatInputBar;
