import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface StoreData {
  id: string;
  slug: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  store: StoreData | null;
  login: (token: string, user: User, store: StoreData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      store: null,
      login: (token, user, store) => set({ token, user, store }),
      logout: () => set({ token: null, user: null, store: null }),
    }),
    {
      name: 'shop-pilot-auth',
    }
  )
);
