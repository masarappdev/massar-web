'use client';

import { AnimatePresence } from 'framer-motion';
import { I18nProvider } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { SplashScreen } from '@/components/delegate/SplashScreen';
import { LoginScreen } from '@/components/delegate/LoginScreen';
import { MainLayout } from '@/components/delegate/MainLayout';

function AppContent() {
  const screen = useAppStore((s) => s.screen);

  return (
    <AnimatePresence mode="wait">
      {screen === 'splash' && <SplashScreen key="splash" />}
      {screen === 'login' && <LoginScreen key="login" />}
      {screen === 'main' && <MainLayout key="main" />}
    </AnimatePresence>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
