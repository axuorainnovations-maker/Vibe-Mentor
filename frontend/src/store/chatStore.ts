import { create } from 'zustand';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  thoughtSeconds?: number;
}

interface ChatState {
  messages: ChatMessage[];
  isThinking: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isThinking: false,
  error: null,

  sendMessage: async (content: string) => {
    const history = get().messages;
    const userMessage: ChatMessage = { role: 'user', content };
    const startedAt = Date.now();

    set({
      messages: [...history, userMessage],
      isThinking: true,
      error: null,
    });

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

      set((state) => ({
        messages: [
          ...state.messages,
          {
            role: 'assistant',
            content: data.content,
            thoughtSeconds: Number(thoughtSeconds.toFixed(1)),
          },
        ],
        isThinking: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      set((state) => ({
        messages: [
          ...state.messages,
          {
            role: 'assistant',
            content: `Sorry, something went wrong: ${message}`,
          },
        ],
        isThinking: false,
        error: message,
      }));
    }
  },

  clearChat: () => set({ messages: [], error: null }),
}));
