import type { ChatMessage } from '../../store/chatStore';

export function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
      <div
        style={{
          background: '#1a1a1a',
          color: '#e5e5e5',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '15px',
          lineHeight: 1.5,
          maxWidth: '85%',
        }}
      >
        {message.content}
      </div>
    </div>
  );
}
