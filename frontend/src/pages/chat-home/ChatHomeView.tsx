import { useState, useEffect, useCallback, useRef, memo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { PanelLeft, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatStore, type ChatMessage } from '../../store/chatStore';

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

function cn(...inputs: Array<string | false | undefined | null>) {
  return inputs.filter(Boolean).join(' ');
}

const PaperclipIcon = ({ className = 'w-[18px] h-[18px]' }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

const SendIcon = ({ className = 'w-[14px] h-[14px]' }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const StopIcon = ({ className = 'w-[12px] h-[12px]' }: { className?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="6" y="6" width="12" height="12" rx="1" />
  </svg>
);

const XIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FileIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

type ImageItem = { id: string; url: string };

type FileItem = { id: string; filename: string; size?: number };

function ImageChip({ url, onRemove }: { url: string; onRemove?: () => void }) {
  return (
    <div className="image-chip">
      <img src={url} alt="" />
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="Remove image" className="image-chip-remove">
          <XIcon className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}

function FileChip({
  filename,
  size,
  onRemove,
}: {
  filename: string;
  size?: number;
  onRemove?: () => void;
}) {
  const sizeText =
    size === undefined
      ? null
      : size < 1024
        ? `${size} B`
        : size < 1024 * 1024
          ? `${(size / 1024).toFixed(1)} KB`
          : `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return (
    <div className="file-chip">
      <span className="file-chip-icon">
        <FileIcon />
      </span>
      <div className="file-chip-content">
        <span className="file-chip-name">{filename}</span>
        {sizeText && <span className="file-chip-size">{sizeText}</span>}
      </div>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="Remove file" className="file-chip-remove">
          <XIcon />
        </button>
      )}
    </div>
  );
}

type UserMessage = { role: 'user'; content: string };

type InputBarProps = {
  onSend?: (msg: UserMessage) => void;
  onStop?: () => void;
  status?: 'ready' | 'streaming' | 'submitted';
  placeholder?: string;
  className?: string;
  onAttach?: () => void;
  attachedImages?: ImageItem[];
  attachedFiles?: FileItem[];
  onRemoveImage?: (id: string) => void;
  onRemoveFile?: (id: string) => void;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
};

const InputBar = memo(function InputBar({
  onSend,
  onStop,
  status = 'ready',
  placeholder = 'Send a message...',
  className,
  onAttach,
  attachedImages = [],
  attachedFiles = [],
  onRemoveImage,
  onRemoveFile,
  value: controlledValue,
  onChange: controlledOnChange,
  disabled,
  autoFocus,
  leftActions,
  rightActions,
}: InputBarProps) {
  const [internalInput, setInternalInput] = useState('');
  const isControlled = controlledValue !== undefined;
  const input = isControlled ? controlledValue : internalInput;
  const setInput = (v: string) => {
    if (isControlled) controlledOnChange?.(v);
    else setInternalInput(v);
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isStreaming = status === 'streaming' || status === 'submitted';
  const hasInput = input.trim().length > 0;
  const hasContextItems = attachedImages.length > 0 || attachedFiles.length > 0;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0';
    const next = Math.min(el.scrollHeight, 120);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden';
  }, [input]);

  useEffect(() => {
    if (!autoFocus) return;
    textareaRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend?.({ role: 'user', content: trimmed });
    setInput('');
  }, [input, isStreaming, disabled, onSend, setInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget || !(e.target as HTMLElement).closest('button, textarea')) {
      textareaRef.current?.focus();
    }
  }, []);

  const sendState = isStreaming ? 'streaming' : hasInput && !disabled ? 'typing' : 'idle';

  return (
    <div className={cn('input-bar-container', className)}>
      <div className="input-bar-inner">
        <div className="input-bar-wrapper dark" onClick={handleContainerClick}>
          <div className={cn('input-attachments', !hasContextItems && 'hidden')}>
            <div className="input-attachments-inner">
              {hasContextItems && (
                <div className="attachments-list">
                  {attachedImages.map((img) => (
                    <ImageChip
                      key={img.id}
                      url={img.url}
                      onRemove={onRemoveImage ? () => onRemoveImage(img.id) : undefined}
                    />
                  ))}
                  {attachedFiles.map((file) => (
                    <FileChip
                      key={file.id}
                      filename={file.filename}
                      size={file.size}
                      onRemove={onRemoveFile ? () => onRemoveFile(file.id) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="input-textarea-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={cn('input-textarea dark')}
            />
          </div>
          <div className="input-bar-footer">
            <div className="input-bar-left">
              {onAttach && (
                <button
                  type="button"
                  onClick={onAttach}
                  disabled={disabled}
                  aria-label="Attach"
                  className="attach-btn dark"
                >
                  <PaperclipIcon />
                </button>
              )}
              {leftActions}
            </div>
            <div className="input-bar-right">
              {rightActions}
              <button
                type="button"
                onClick={() => {
                  if (isStreaming) onStop?.();
                  else if (hasInput) handleSubmit();
                }}
                aria-label={isStreaming ? 'Stop' : 'Send'}
                className={cn('send-btn dark', sendState)}
              >
                {isStreaming ? <StopIcon /> : <SendIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const pills = [
  'Voice note organizer',
  'Flashcard app with spaced repetition',
  'Travel itinerary builder',
  'Local pickup sports app',
  'Pomodoro timer with analytics',
];

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className="message-row" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '24px',
    }}>
      {isUser ? (
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '8px 16px',
          maxWidth: '80%',
          wordWrap: 'break-word',
        }}>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.5',
            color: 'rgba(255,255,255,0.95)',
            margin: 0,
          }}>
            {message.content}
          </p>
        </div>
      ) : (
        <div style={{ width: '100%' }}>
          <div className="message-label" style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '8px',
            padding: '0 4px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="19" cy="12" r="2" fill="currentColor" />
              <circle cx="5" cy="12" r="2" fill="currentColor" />
            </svg>
            Thought for 0.2s
          </div>
          <div className="message-content" style={{
            background: 'transparent',
            border: 'none',
            borderRadius: '10px',
            padding: '0 4px',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
          }}>
            {message.content}
          </div>
        </div>
      )}
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="message-row" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: '16px',
    }}>
      <div className="message-label" style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: '4px',
        padding: '0 4px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        Vibe Mentor
      </div>
      <div className="thinking-bubble" style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div className="thinking-dots" style={{ display: 'flex', gap: '4px' }}>
          <div className="thinking-dot" style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            animation: 'thinkingBounce 1.4s ease-in-out infinite',
          }} />
          <div className="thinking-dot" style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            animation: 'thinkingBounce 1.4s ease-in-out infinite',
            animationDelay: '0.2s',
          }} />
          <div className="thinking-dot" style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            animation: 'thinkingBounce 1.4s ease-in-out infinite',
            animationDelay: '0.4s',
          }} />
        </div>
        <span style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.5)',
          fontWeight: 500,
        }}>Thinking...</span>
      </div>
    </div>
  );
}

/* ---- New Landing Design Components ---- */

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

function CircleButton({ children }: { children: ReactNode }) {
  return (
    <button
      className="w-[30px] h-[30px] rounded-full bg-[#222222] border border-white/[0.045] flex items-center justify-center text-white/52 hover:bg-[#272727] transition-all duration-150 active:scale-[0.97]"
      style={{
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.03),
          0 1px 2px rgba(0,0,0,0.22)
        `,
      }}
    >
      {children}
    </button>
  );
}

function ToolbarIcon({ children }: { children: ReactNode }) {
  return (
    <button className="w-[22px] h-[22px] flex items-center justify-center text-white/40 hover:text-white/62 transition-all duration-150 active:scale-[0.96]">
      {children}
    </button>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <button
      className="h-[34px] px-[14px] rounded-full bg-[#1a1a1a] border border-white/[0.06] flex items-center gap-[7px] text-[14px] font-[500] text-white/72"
      style={{
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.04),
          0 1px 2px rgba(0,0,0,0.24)
        `,
      }}
    >
      {label}
      <span className="text-white/40">{'\u2304'}</span>
    </button>
  );
}

function EmptyLanding({ onSend, isThinking }: { onSend: (msg: UserMessage) => void; isThinking: boolean }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    onSend({ role: 'user', content: trimmed });
    setInput('');
  }, [input, isThinking, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="flex h-full w-full" style={{ background: '#0b0b0c' }}>
      {/* Sidebar */}
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

      {/* Main */}
      <main className="flex-1 flex flex-col items-center" style={{ paddingTop: '200px', background: '#0b0b0c' }}>
        {/* Hero Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/[0.035] blur-3xl rounded-full scale-[2]" />
          <div className="relative flex items-center justify-center">
            <div className="relative z-10 scale-[1.55]">
              <Cloud3Icon />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="mt-[28px] text-center"
          style={{
            fontSize: '38px',
            lineHeight: '0.98',
            letterSpacing: '-0.07em',
            fontWeight: 700,
            color: '#f5f5f5',
            maxWidth: '620px',
          }}
        >
          What do you want to create today?
        </h1>

        {/* Typebar */}
        <div
          className="relative mt-[42px] overflow-hidden"
          style={{
            width: '708px',
            height: '168px',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.055)',
            background: 'linear-gradient(to bottom, rgba(28,28,28,1), rgba(18,18,18,1))',
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.05),
              inset 0 -1px 0 rgba(255,255,255,0.02),
              0 0 0 1px rgba(255,255,255,0.02),
              0 1px 2px rgba(0,0,0,0.45),
              0 14px 34px rgba(0,0,0,0.42),
              0 38px 90px rgba(0,0,0,0.38),
              0 70px 120px rgba(0,0,0,0.22)
            `,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at top, rgba(255,255,255,0.04), transparent 60%)' }}
          />

          <textarea
            ref={textareaRef}
            placeholder="Describe what you want to create or learn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute resize-none bg-transparent outline-none border-none text-[16px] font-[450] leading-[24px] text-white placeholder-white/28"
            style={{ top: '18px', left: '22px', right: '22px', height: '90px' }}
          />

          <div
            className="absolute flex items-center justify-between"
            style={{ bottom: '16px', left: '18px', right: '18px' }}
          >
            <div className="flex items-center gap-[10px]">
              <CircleButton>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </CircleButton>

              <ToolbarIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="9" cy="9" r="1.4" fill="currentColor" />
                  <path d="M7 17L12 12L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </ToolbarIcon>

              <ToolbarIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="8" cy="8" r="3" fill="#F24E1E" />
                  <circle cx="16" cy="8" r="3" fill="#FF7262" />
                  <circle cx="8" cy="16" r="3" fill="#0ACF83" />
                  <circle cx="16" cy="16" r="3" fill="#1ABCFE" />
                </svg>
              </ToolbarIcon>

              <Pill label="Auto" />
              <Pill label="Default" />
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="flex items-center justify-center text-black"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#f4f4f4',
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.4),
                  0 1px 2px rgba(0,0,0,0.3),
                  0 10px 24px rgba(0,0,0,0.18)
                `,
              }}
            >
              {'\u2191'}
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-[38px] flex items-center gap-3 text-[12px] text-white/42 font-[500]">
          <span className="font-[800] italic text-white">MAX</span>
          <div className="w-px h-4 bg-white/12" />
          <span>Ultra coding agent with its own browser</span>
          <div
            className="px-[8px] py-[2px] rounded-[7px] bg-white text-black text-[11px] font-[700]"
          >
            New
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---- Main Export ---- */

export default function ChatHomeView() {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { messages, isThinking, sendMessage } = useChatStore();
  const [inputValue, setInputValue] = useState('');
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

  const handleSend = (msg: UserMessage) => {
    sendMessage(msg.content);
  };

  return (
    <div className="chat-home-scope">
      <div className="app-root">
        <div className="noise-bg" />
        <div className="dot-grid" />

        {hasMessages ? (
          <div className="dashboard-page visible" style={{ flexDirection: 'column' }}>
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
              <div className="dashboard-inner" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: '24px' }}>
                <div className="messages-container" style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '0 24px 16px',
                  maxWidth: '720px',
                  margin: '0 auto',
                  width: '100%',
                }}>
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} />
                  ))}
                  {isThinking && <ThinkingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
                <div style={{ padding: '0 24px 24px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
                  <InputBar
                    placeholder="Make updates to your app..."
                    onSend={handleSend}
                    status={isThinking ? 'streaming' : 'ready'}
                    disabled={isThinking}
                    autoFocus
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-page visible" style={{ padding: 0 }}>
            <EmptyLanding onSend={handleSend} isThinking={isThinking} />
          </div>
        )}
      </div>
    </div>
  );
}
