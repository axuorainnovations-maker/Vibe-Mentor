import { create } from 'zustand';
import { api } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  ageGroup: string;
  profilePicture?: string;
  learningGoals?: string;
  interests?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; name: string; ageGroup: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });
  },

  signup: async (signupData) => {
    const data = await api.post('/auth/signup', signupData);
    localStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await api.get('/auth/me');
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const user = await api.put('/auth/me', data);
    set({ user });
  },
}));
