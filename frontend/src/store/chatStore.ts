import { create } from 'zustand';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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
    const userMessage: ChatMessage = { role: 'user', content };
    set((state) => ({
      messages: [...state.messages, userMessage],
      isThinking: true,
      error: null,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: get().messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      set((state) => ({
        messages: [...state.messages, { role: 'assistant', content: data.content }],
        isThinking: false,
      }));
    } catch (err: any) {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            role: 'assistant',
            content: `Sorry, something went wrong: ${err.message}`,
          },
        ],
        isThinking: false,
        error: err.message,
      }));
    }
  },

  clearChat: () => set({ messages: [], error: null }),
}));