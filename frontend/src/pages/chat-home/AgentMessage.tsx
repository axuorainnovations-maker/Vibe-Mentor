import { useEffect, useRef, useState, useCallback } from 'react';
import type { ChatMessage } from '../../store/chatStore';

type Phase = 'dot' | 'header' | 'streaming' | 'thought' | 'answering' | 'done';

function typeText(
  element: HTMLElement | null,
  fullText: string,
  intervalMs: number,
  chunkSize: number,
  onComplete?: () => void,
) {
  if (!element) { onComplete?.(); return; }
  const totalLength = fullText.length;
  let index = 0;
  element.textContent = '';

  function tick() {
    if (index >= totalLength) { onComplete?.(); return; }
    const nextIndex = Math.min(index + chunkSize, totalLength);
    const visibleText = fullText.slice(0, nextIndex);
    const el = element;
    requestAnimationFrame(() => { el!.textContent = visibleText; });
    index = nextIndex;
    setTimeout(tick, intervalMs);
  }
  tick();
}

export function AgentMessage({ message }: { message: ChatMessage }) {
  const [phase, setPhase] = useState<Phase>(() => (message.content ? 'header' : 'dot'));
  const [collapsed, setCollapsed] = useState(false);
  const thinkingContentRef = useRef<HTMLDivElement>(null);
  const answerContentRef = useRef<HTMLDivElement>(null);

  const thinking = message.thinking || '';
  const content = message.content;
  const thoughtSeconds = message.thoughtSeconds;

  // Sequential phase flow:
  // dot (0.85s) → header → streaming (types thinking) → thought →
  //   collapsed (300ms) → answering (types content) → done

  // Dot → Header
  useEffect(() => {
    if (phase !== 'dot') return;
    const t = setTimeout(() => setPhase('header'), 850);
    return () => clearTimeout(t);
  }, [phase]);

  // Header → Streaming (only when thinking text exists)
  // If no thinking but has content → skip to thought
  // If no thinking and no content → stay in header (optimistic wait)
  useEffect(() => {
    if (phase !== 'header') return;
    if (thinking) {
      const t = setTimeout(() => setPhase('streaming'), 300);
      return () => clearTimeout(t);
    }
    if (content) {
      setPhase('thought');
    }
  }, [phase, thinking, content]);

  // Streaming: type thinking text
  useEffect(() => {
    if (phase !== 'streaming') return;
    const t = setTimeout(() => {
      typeText(thinkingContentRef.current, thinking, 18, 3, () => {
        setPhase('thought');
      });
    }, 300);
    return () => clearTimeout(t);
  }, [phase, thinking]);

  // Thought: show label → collapse → answer
  useEffect(() => {
    if (phase !== 'thought') return;
    const collapseTimer = setTimeout(() => setCollapsed(true), 300);
    const answerTimer = setTimeout(() => setPhase('answering'), 600);
    return () => { clearTimeout(collapseTimer); clearTimeout(answerTimer); };
  }, [phase]);

  // Answering: type answer text
  useEffect(() => {
    if (phase !== 'answering') return;
    const t = setTimeout(() => {
      typeText(answerContentRef.current, content, 16, 3, () => {
        setPhase('done');
      });
    }, 300);
    return () => clearTimeout(t);
  }, [phase, content]);

  const toggleThinking = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  const isClickable = phase === 'thought' || phase === 'answering' || phase === 'done';

  return (
    <div style={{ marginBottom: '28px' }}>
        {phase === 'dot' && (
          <div
            style={{
              width: '14px',
              height: '14px',
              background: '#e5e5e5',
              borderRadius: '50%',
              margin: '10px 0 18px 2px',
              animation: 'agentPulse 0.85s ease-in-out infinite',
            }}
          />
        )}

        {phase !== 'dot' && (
          <div style={{ marginBottom: '14px' }}>
            <div
              onClick={isClickable ? toggleThinking : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0',
                userSelect: 'none',
                cursor: isClickable ? 'pointer' : 'default',
              }}
            >
              <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a0a0a0" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-4 12.75V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.25A7 7 0 0 0 12 2Z" />
                </svg>
              </div>

              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e5e5e5',
                  letterSpacing: '-0.1px',
                }}
              >
                {phase === 'thought' || phase === 'answering' || phase === 'done'
                  ? `Thought for ${thoughtSeconds ?? 0.1}s`
                  : 'Thinking'}
              </span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  width: '14px',
                  height: '14px',
                  stroke: '#8a8a8a',
                  strokeWidth: 2,
                  marginLeft: '2px',
                  opacity: isClickable ? 1 : 0,
                  transition: 'opacity 0.2s, transform 0.25s ease',
                  transform: !collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div
              style={{
                paddingLeft: '24px',
                marginTop: collapsed ? '0' : '6px',
                maxHeight: collapsed ? '0' : '600px',
                opacity: collapsed ? 0 : 1,
                overflow: 'hidden',
                transition: 'max-height 0.25s ease, opacity 0.25s ease, margin 0.25s ease',
              }}
            >
              <div
                ref={thinkingContentRef}
                style={{
                  fontSize: '14px',
                  color: '#b0b0b0',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                  fontWeight: 400,
                }}
              />
            </div>
          </div>
        )}

        {(phase === 'answering' || phase === 'done' || (!thinking && phase === 'thought')) && content && (
          <div style={{ marginTop: '2px' }}>
            {phase === 'answering' || phase === 'done' ? (
              <div
                ref={answerContentRef}
                style={{
                  fontSize: '15px',
                  color: '#e5e5e5',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  letterSpacing: '-0.1px',
                }}
              />
            ) : (
              <div style={{ fontSize: '15px', color: '#e5e5e5', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {content.split('\n').map((p, i) => (
                  <p key={i} style={{ margin: 0, marginBottom: i < content.split('\n').length - 1 ? '16px' : 0 }}>{p}</p>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
