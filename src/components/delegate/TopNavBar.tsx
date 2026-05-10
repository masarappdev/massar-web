'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

const languageList: { code: Locale; label: string; flag: string }[] = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export function TopNavBar() {
  const { t, locale, setLocale } = useI18n();
  const { user } = useAppStore();
  const nav = t.nav as Record<string, string>;
  const currentLang = languageList.find((l) => l.code === locale)!;
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Profile Section (start side in RTL) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007AFF] to-[#0055CC] flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name?.charAt(0) || 'م'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user?.name || 'المندوب'}
            </p>
            <p className="text-xs text-gray-400">
              #{user?.nationalId || '—'}
            </p>
          </div>
        </div>

        {/* Action Icons (end side in RTL) */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-0.5 -end-0.5 w-4 h-4 bg-[#FF3B30] rounded-full text-[10px] text-white font-bold flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 h-10 px-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-[11px] font-medium text-gray-700">
                {currentLang.label}
              </span>
              <motion.span
                animate={{ rotate: langOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </motion.span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1.5 end-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px] overflow-hidden z-50"
                >
                  {languageList.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors ${
                        locale === lang.code ? 'bg-[#007AFF]/5 text-[#007AFF]' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm">{lang.flag}</span>
                      <span className="flex-1 text-start font-medium text-[12px]">{lang.label}</span>
                      {locale === lang.code && <Check className="w-3.5 h-3.5 text-[#007AFF]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
