import { create } from 'zustand';
import type { Locale } from './i18n';

export type AppScreen = 'splash' | 'login' | 'main';

interface AppState {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    name: string;
    avatarUrl: string | null;
    nationalId: string;
  } | null;
  setUser: (user: { name: string; avatarUrl: string | null; nationalId: string } | null) => void;
  activeServiceForm: string | null;
  setActiveServiceForm: (form: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'splash',
  setScreen: (screen) => set({ screen }),
  activeTab: 'home',
  setActiveTab: (activeTab) => set({ activeTab }),
  user: null,
  setUser: (user) => set({ user }),
  activeServiceForm: null,
  setActiveServiceForm: (form) => set({ activeServiceForm: form }),
}));
