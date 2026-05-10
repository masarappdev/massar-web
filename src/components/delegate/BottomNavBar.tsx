'use client';

import { motion } from 'framer-motion';
import { Home, FileText, MessageCircle, BellRing, User } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

const tabs = [
  { id: 'home', icon: Home, labelKey: 'home' },
  { id: 'services', icon: FileText, labelKey: 'services' },
  { id: 'messages', icon: MessageCircle, labelKey: 'messages' },
  { id: 'updates', icon: BellRing, labelKey: 'updates' },
  { id: 'profile', icon: User, labelKey: 'profile' },
] as const;

export function BottomNavBar() {
  const { t } = useI18n();
  const { activeTab, setActiveTab } = useAppStore();
  const nav = t.nav as Record<string, string>;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        className="pointer-events-auto mx-1 mb-4 rounded-[1.5rem] bg-gradient-to-br from-[#0055CC] via-[#007AFF] to-[#3395FF] backdrop-blur-2xl shadow-[0_-4px_24px_rgba(0,122,255,0.35)] border border-white/20"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25, delay: 0.3 }}
      >
        <div className="flex items-center justify-around gap-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center justify-center min-w-[58px] py-1.5 px-1.5 rounded-2xl transition-all duration-300"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-1 bg-white/20 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-white/55'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </motion.div>
                <span
                  className={`text-[10px] mt-1 font-bold transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/45'
                  }`}
                >
                  {nav[tab.labelKey]}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
