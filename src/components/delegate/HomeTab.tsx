'use client';

import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function HomeTab() {
  const { t } = useI18n();
  const tabs = t.tabs as Record<string, string>;

  return (
    <motion.div
      className="px-4 py-6 pb-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{tabs.homeTitle}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{tabs.homeSubtitle}</p>
      </div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm mx-auto mb-4 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Home className="w-8 h-8 text-[#007AFF]" />
          </motion.div>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{tabs.comingSoon}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{tabs.comingSoonDesc}</p>
      </motion.div>
    </motion.div>
  );
}
