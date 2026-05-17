import { create } from 'zustand';

export type AppRole = 'admin' | 'user';

type AuthStore = {
  role: AppRole;
  setRole: (role: AppRole) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  role: 'admin',
  setRole: (role) => set({ role })
}));

