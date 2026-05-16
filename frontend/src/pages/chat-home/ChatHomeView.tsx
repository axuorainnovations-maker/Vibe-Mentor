import { useState, useEffect, useCallback, useRef, memo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { PanelLeft, Bell } from 'lucide-react';
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

function Logo({ size = 72 }: { size?: number }) {
  const s = size;
  return (
    <svg
      className="logo"
      width={s}
      height={Math.round(s * 0.72)}
      viewBox="0 0 100 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 8 L48 44" stroke="rgba(255,255,255,0.75)" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M48 8 L12 44" stroke="rgba(255,255,255,0.75)" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M52 8 L88 44" stroke="rgba(255,255,255,0.75)" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M88 8 L52 44" stroke="rgba(255,255,255,0.75)" strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  );
}

function DocListIcon() {
  return (
    <svg className="doc-icon" viewBox="0 0 30 38" aria-hidden>
      <rect className="doc-bg" x="1" y="1" width="28" height="36" rx="1.8" />
      <line className="doc-line" x1="10" y1="11" x2="22" y2="11" />
      <line className="doc-line" x1="10" y1="15" x2="18" y2="15" />
    </svg>
  );
}

const EDITORIAL_ROWS = [
  { title: 'The Rarity Principle', meta: 'Created on Oct 11, 2025' },
  { title: 'Useful Easing & Cubic Functions', meta: 'Created on Oct 8, 2025' },
  { title: 'How Linear Balances Form and Function', meta: 'Created on Oct 6, 2025' },
  { title: 'Choosing the Right Easing Curve', meta: 'Created on Oct 2, 2025' },
  { title: 'Taking Advantage of Pseudo Elements', meta: 'Created on Sep 24, 2025' },
  { title: 'The Art of Curating', meta: 'Created on Sep 4, 2025' },
] as const;

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
        {isUser ? 'You' : 'Vibe Mentor'}
      </div>
      <div className="message-content" style={{
        background: isUser ? 'rgba(255,255,255,0.08)' : 'rgba(52,199,89,0.08)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '10px 14px',
        maxWidth: '85%',
        color: 'rgba(255,255,255,0.85)',
        fontSize: '14px',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
      }}>
        {message.content}
      </div>
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

        <div className="dashboard-page visible">
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

          {hasMessages ? (
            <div className="dashboard-scroll-body" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="dashboard-inner" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: '24px' }}>
                <div className="messages-container" style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '0 24px',
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
                <div style={{ padding: '16px 24px 24px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
                  <InputBar
                    placeholder="Send a message..."
                    onSend={handleSend}
                    status={isThinking ? 'streaming' : 'ready'}
                    disabled={isThinking}
                    autoFocus
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-scroll-body">
              <div className="dashboard-inner">
                <div className="dash-logo">
                  <Logo size={68} />
                </div>
                <div className="dash-title">What would you like to build?</div>

                <InputBar
                  placeholder="Tell me your idea..."
                  onSend={handleSend}
                  status={isThinking ? 'streaming' : 'ready'}
                  disabled={isThinking}
                  onAttach={() => console.log('Attach clicked')}
                  attachedImages={[]}
                  attachedFiles={[]}
                />

                <div className="pills-row">
                  {pills.map((p, i) => (
                    <div key={i} className="pill">
                      {p}
                    </div>
                  ))}
                  <div
                    className="pill"
                    style={{ background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path
                        d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2M2.8 2.8l1.4 1.4M8.8 8.8l1.4 1.4M2.8 10.2l1.4-1.4M8.8 4.2l1.4-1.4"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="content-list">
                  {EDITORIAL_ROWS.map((row, i) => (
                    <div key={i} className="content-row">
                      <div className="thumbnail">
                        <DocListIcon />
                      </div>
                      <div className="content-info">
                        <p className="content-title">{row.title}</p>
                        <p className="content-meta">{row.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}