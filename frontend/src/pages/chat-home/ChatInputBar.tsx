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
  className,
  disabled,
  autoFocus,
}: ChatInputBarProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className={className}>
      <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2 text-gray-400">
          <button type="button" className="text-lg leading-none" aria-label="Add">+</button>
          <button type="button" className="text-lg leading-none" aria-label="Design">{'\uD83C\uDFA8'}</button>
        </div>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-white px-4 text-sm"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-sm text-gray-300 border border-white/10 px-3 py-1 rounded-lg bg-transparent"
          >
            Auto
          </button>
          <button
            type="button"
            className="text-sm text-gray-300 border border-white/10 px-3 py-1 rounded-lg bg-transparent"
          >
            Default
          </button>
          <button
            type="button"
            onClick={() => {
              if (isStreaming) onStop?.();
              else if (input.trim()) handleSubmit();
            }}
            aria-label={isStreaming ? 'Stop' : 'Send'}
            className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-sm"
          >
            {isStreaming ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            ) : (
              <span>{'\u25CF'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChatInputBar;
