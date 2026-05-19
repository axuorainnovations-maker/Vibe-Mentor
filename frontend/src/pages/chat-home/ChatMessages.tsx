import type { ChatMessage } from '../../store/chatStore';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="bg-neutral-800 px-4 py-2 rounded-xl text-sm text-white">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
        <span>{'\u2699\uFE0F'}</span>
        <span>Thought for 0.2s</span>
      </div>
      <div className="text-base leading-relaxed whitespace-pre-line text-gray-100">
        {message.content}
      </div>
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
        <span>{'\u2699\uFE0F'}</span>
        <span>Thinking...</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}
