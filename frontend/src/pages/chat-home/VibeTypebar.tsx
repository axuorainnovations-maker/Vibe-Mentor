import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';

function CircleButton({
  children,
  size = 30,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <button
      type="button"
      className="vibe-typebar-circle-btn"
      style={{ width: size, height: size }}
    >
      {children}
    </button>
  );
}

function ToolbarIcon({
  children,
  size = 22,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <button type="button" className="vibe-typebar-toolbar-icon" style={{ width: size, height: size }}>
      {children}
    </button>
  );
}

function Pill({ label, compact }: { label: string; compact?: boolean }) {
  return (
    <button type="button" className={`vibe-typebar-pill${compact ? ' compact' : ''}`}>
      {label}
      <span className="vibe-typebar-pill-caret">{'\u2304'}</span>
    </button>
  );
}

export type VibeTypebarProps = {
  variant?: 'hero' | 'compact';
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  isStreaming?: boolean;
  onStop?: () => void;
};

export default function VibeTypebar({
  variant = 'hero',
  value,
  onChange,
  onSubmit,
  placeholder = 'Describe what you want to create or learn...',
  disabled = false,
  isStreaming = false,
  onStop,
}: VibeTypebarProps) {
  const compact = variant === 'compact';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!compact) textareaRef.current?.focus();
  }, [compact]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    if (isStreaming) {
      onStop?.();
      return;
    }
    onSubmit();
  }, [value, disabled, isStreaming, onStop, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const sendSize = compact ? 28 : 30;
  const circleSize = compact ? 26 : 28;
  const iconSize = compact ? 16 : 17;

  return (
    <motion.div
      layout
      className={`vibe-typebar${compact ? ' vibe-typebar--compact' : ' vibe-typebar--hero'}`}
    >
      <motion.div layout className="vibe-typebar-sheen" aria-hidden />

      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled && !isStreaming}
        className="vibe-typebar-input"
      />

      <motion.div layout className="vibe-typebar-toolbar">
        <motion.div layout className="vibe-typebar-toolbar-left">
          <CircleButton size={circleSize}>
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </CircleButton>

          <ToolbarIcon size={compact ? 20 : 21}>
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="9" cy="9" r="1.4" fill="currentColor" />
              <path
                d="M7 17L12 12L17 17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ToolbarIcon>

          <ToolbarIcon size={compact ? 20 : 21}>
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
              <circle cx="8" cy="8" r="3" fill="#F24E1E" />
              <circle cx="16" cy="8" r="3" fill="#FF7262" />
              <circle cx="8" cy="16" r="3" fill="#0ACF83" />
              <circle cx="16" cy="16" r="3" fill="#1ABCFE" />
            </svg>
          </ToolbarIcon>

          <Pill label="Auto" compact={compact} />
          <Pill label="Default" compact={compact} />
        </motion.div>

        {compact && (
          <span className="vibe-typebar-max-promo">
            Try <strong>MAX</strong> New
          </span>
        )}

        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={disabled && !isStreaming && !value.trim()}
          className="vibe-typebar-send"
          style={{ width: sendSize, height: sendSize }}
          aria-label={isStreaming ? 'Stop' : 'Send'}
        >
          {isStreaming ? (
            <span className="vibe-typebar-stop-icon" />
          ) : (
            '\u2191'
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
