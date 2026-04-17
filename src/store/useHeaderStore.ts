import { create } from 'zustand';

interface PageHeaderState {
  title: string;
  description?: string;
  permissions: { text: string; color: string }[];
  setTitle: (title: string, desc?: string, perms?: { text: string; color: string }[]) => void;
}

export const useHeaderStore = create<PageHeaderState>((set) => ({
  title: '系统总览',
  description: '',
  permissions: [],
  setTitle: (title, description = '', permissions = []) => set({ title, description, permissions }),
}));
