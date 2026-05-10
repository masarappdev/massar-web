'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { TopNavBar } from './TopNavBar';
import { BottomNavBar } from './BottomNavBar';
import { HomeTab } from './HomeTab';
import { ServicesTab } from './ServicesTab';
import { MessagesTab } from './MessagesTab';
import { UpdatesTab } from './UpdatesTab';
import { ProfileTab } from './ProfileTab';

const tabComponents: Record<string, React.ComponentType> = {
  home: HomeTab,
  services: ServicesTab,
  messages: MessagesTab,
  updates: UpdatesTab,
  profile: ProfileTab,
};

export function MainLayout() {
  const activeTab = useAppStore((s) => s.activeTab);
  const activeServiceForm = useAppStore((s) => s.activeServiceForm);
  const ActiveComponent = tabComponents[activeTab] || HomeTab;
  const isFormActive = !!activeServiceForm;

  return (
    <motion.div
      className="min-h-screen bg-[#F8F9FA]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {!isFormActive && <TopNavBar />}
      <main>
        <AnimatePresence mode="wait">
          <ActiveComponent key={activeTab} />
        </AnimatePresence>
      </main>
      {!isFormActive && <BottomNavBar />}
    </motion.div>
  );
}
