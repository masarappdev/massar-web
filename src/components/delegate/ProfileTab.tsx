'use client';

import { motion } from 'framer-motion';
import { User, LogOut, ChevronRight, Globe, Shield, HelpCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

export function ProfileTab() {
  const { t, locale, toggleDirection } = useI18n();
  const { user, setScreen, setUser } = useAppStore();
  const tabs = t.tabs as Record<string, string>;
  const common = t.common as Record<string, string>;
  const nav = t.nav as Record<string, string>;

  const languageNames: Record<string, string> = { ar: 'العربية', en: 'English', hi: 'हिन्दी' };

  const handleLogout = () => {
    setUser(null);
    setScreen('login');
  };

  const menuItems = [
    { icon: Globe, label: nav.settings, action: toggleDirection, detail: languageNames[locale] },
    { icon: Shield, label: locale === 'ar' ? 'الخصوصية والأمان' : locale === 'hi' ? 'गोपनीयता और सुरक्षा' : 'Privacy & Security', detail: null },
    { icon: HelpCircle, label: locale === 'ar' ? 'المساعدة والدعم' : locale === 'hi' ? 'सहायता और समर्थन' : 'Help & Support', detail: null },
  ];

  return (
    <motion.div
      className="px-4 py-6 pb-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{tabs.profileTitle}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{tabs.profileSubtitle}</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#0055CC] flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {user?.name?.charAt(0) || 'م'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{user?.name || 'المندوب'}</h2>
            <p className="text-sm text-gray-500">ID: {user?.nationalId || '—'}</p>
            <p className="text-xs text-[#007AFF] font-medium mt-0.5">
              {locale === 'ar' ? 'مندوب نشط' : locale === 'hi' ? 'सक्रिय प्रतिनिधि' : 'Active Delegate'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-gray-600" />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-800 text-start">{item.label}</span>
              {item.detail && (
                <span className="text-xs text-gray-400 font-medium">{item.detail}</span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </motion.button>
          );
        })}
      </div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] font-semibold rounded-2xl transition-colors active:scale-[0.98]"
      >
        <LogOut className="w-5 h-5" />
        {common.logout}
      </motion.button>
    </motion.div>
  );
}
