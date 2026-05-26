import { create } from 'zustand';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  thoughtSeconds?: number;
}

interface ChatState {
  messages: ChatMessage[];
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  error: null,

  sendMessage: async (content: string) => {
    const history = get().messages;
    const userMessage: ChatMessage = { role: 'user', content };
    const pendingMessage: ChatMessage = { role: 'assistant', content: '', thinking: '' };
    const startedAt = Date.now();

    set({ messages: [...history, userMessage, pendingMessage], error: null });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      const thoughtSeconds = Math.max(0.1, (Date.now() - startedAt) / 1000);

      set((state) => {
        const msgs = [...state.messages];
        const idx = msgs.length - 1;
        if (idx >= 0 && msgs[idx].role === 'assistant' && !msgs[idx].content) {
          msgs[idx] = {
            role: 'assistant',
            thinking: data.thinking,
            content: data.content,
            thoughtSeconds: Number(thoughtSeconds.toFixed(1)),
          };
        }
        return { messages: msgs };
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      set((state) => {
        const msgs = [...state.messages];
        const idx = msgs.length - 1;
        if (idx >= 0 && msgs[idx].role === 'assistant' && !msgs[idx].content) {
          msgs[idx] = {
            role: 'assistant',
            thinking: 'I encountered an error while processing your request.',
            content: `Sorry, something went wrong: ${message}`,
            thoughtSeconds: 0.1,
          };
        }
        return { messages: msgs, error: message };
      });
    }
  },

  clearChat: () => set({ messages: [], error: null }),
}));
