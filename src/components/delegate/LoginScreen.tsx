'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Fingerprint, IdCard, Lock, Globe, ArrowRight, ArrowLeft, Check, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

const languageList: { code: Locale; label: string; flag: string }[] = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export function LoginScreen() {
  const { t, locale, setLocale } = useI18n();
  const { setScreen, setUser } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const login = t.login as Record<string, string>;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogin = async () => {
    if (!nationalId || !password) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setUser({ name: 'أحمد محمد', avatarUrl: null, nationalId });
    setScreen('main');
    setIsLoading(false);
  };

  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const currentLang = languageList.find((l) => l.code === locale)!;

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="min-h-screen bg-white flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: isRTL ? -100 : 100 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="relative h-60 bg-gradient-to-br from-[#007AFF] to-[#0055CC] flex flex-col items-center justify-end pb-8 overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 rounded-full bg-white/5" />

        {/* Language Dropdown */}
        <motion.div
          ref={langRef}
          className="absolute top-3 end-3 z-50"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/20 hover:bg-white/25 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{currentLang.label}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-1.5 end-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[130px] overflow-hidden"
              >
                {languageList.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                      locale === lang.code ? 'bg-[#007AFF]/5 text-[#007AFF]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="flex-1 text-start font-medium text-xs">{lang.label}</span>
                    {locale === lang.code && <Check className="w-3.5 h-3.5 text-[#007AFF]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Logo */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <Image
            src="/images/logo-header.png"
            alt="مسار - Massar"
            width={80}
            height={86}
            priority
            className="drop-shadow-md"
          />
        </motion.div>

        <motion.h2
          className="text-white mt-3 text-[1.85rem] font-black tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          مسار - Massar
        </motion.h2>
        <motion.p
          className="text-white/70 mt-1.5 text-[13px] font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          {login.tagline}
        </motion.p>
      </div>

      {/* Login Form */}
      <motion.div
        className="flex-1 bg-white rounded-t-3xl -mt-4 relative z-10 mx-3 px-5 pt-5 pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1 variants={itemVariants} className="text-[1.5rem] font-black text-gray-900 text-center tracking-tight leading-snug">
          {login.title}
        </motion.h1>
        <motion.p variants={itemVariants} className="text-[14px] text-gray-400 text-center mt-1.5 mb-6">
          {login.subtitle}
        </motion.p>

        <form onSubmit={(e) => { e.preventDefault(); if (document.activeElement === passwordRef.current) { handleLogin(); } else { passwordRef.current?.focus(); } }} className="contents">

        {/* National ID */}
        <motion.div variants={itemVariants} className="mb-3.5">
          <label className="block text-[14px] font-bold text-gray-700 mb-1.5">
            {login.nationalId}
          </label>
          <div className="relative">
            <IdCard className="absolute start-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder={login.nationalIdPlaceholder}
              className="w-full ps-11 pe-3 py-3 bg-gray-50/80 border border-gray-200/80 rounded-2xl text-[15px] text-gray-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF]/60 focus:bg-white transition-all"
              style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}
              inputMode="numeric"
              autoComplete="off"
              enterKeyHint="next"
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants} className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[14px] font-bold text-gray-700">
              {login.password}
            </label>
            <button className="text-[12px] text-[#007AFF] font-semibold hover:underline">
              {login.forgotPassword}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
            <input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={login.passwordPlaceholder}
              className="w-full ps-11 pe-11 py-3 bg-gray-50/80 border border-gray-200/80 rounded-2xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF]/60 focus:bg-white transition-all"
              enterKeyHint="go"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </motion.div>

        {/* Login + Biometric Buttons */}
        <motion.div variants={itemVariants} className="flex items-center gap-2.5">
          <button
            onClick={handleLogin}
            disabled={isLoading || !nationalId || !password}
            className="flex-1 py-3 bg-[#007AFF] hover:bg-[#0066DD] disabled:bg-gray-300 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-[#007AFF]/25 hover:shadow-xl hover:shadow-[#007AFF]/30 active:scale-[0.98] flex items-center justify-center gap-2 text-[15px] tracking-wide"
          >
            {isLoading ? (
              <motion.div
                className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <>
                {login.loginButton}
                <ArrowIcon className="w-4 h-4" />
              </>
            )}
          </button>
          <button
            className="w-[3.25rem] h-[3.25rem] shrink-0 bg-gray-50 hover:bg-gray-100 text-[#007AFF] rounded-2xl transition-all duration-200 flex items-center justify-center active:scale-[0.95] border border-gray-200/80"
          >
            <Fingerprint className="w-[22px] h-[22px]" />
          </button>
        </motion.div>

        {/* Contact Support */}
        <motion.div variants={itemVariants} className="mt-4 text-center">
          <p className="text-[12px] text-gray-400 leading-relaxed">
            {login.noAccount}{' '}
            <button className="text-[#007AFF] font-semibold hover:underline">{login.contactSupport}</button>
          </p>
        </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
