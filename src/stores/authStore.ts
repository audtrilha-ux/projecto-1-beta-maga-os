import { create } from 'zustand';
import { auth } from '../lib/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user, loading: false }),
  init: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false, initialized: true });
    });
  },
}));
