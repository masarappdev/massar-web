'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

export function SplashScreen() {
  const { t } = useI18n();
  const setScreen = useAppStore((s) => s.setScreen);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#007AFF] to-[#0055CC] px-8 overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 rounded-full bg-white/5" />

      {/* Glow behind icon */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-white/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo with float */}
      <motion.div
        className="relative z-10 mb-4"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          className="relative w-[100px] h-[108px]"
        >
          <Image
            src="/images/logo-splash.png"
            alt="مسار - Massar"
            fill
            priority
            className="drop-shadow-lg object-contain"
          />
        </motion.div>
      </motion.div>

      {/* App Name */}
      <motion.h1
        className="text-[2rem] font-black text-white mb-3 text-center tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        مسار - Massar
      </motion.h1>

      {/* Tagline Arabic */}
      <motion.p
        className="text-lg text-white/80 text-center font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        بوابتك لعمل أسهل وأرباح تتخطى التوقعات
      </motion.p>

      {/* Tagline English */}
      <motion.p
        className="text-sm text-white/60 text-center font-medium mt-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        Your gateway to easier work and higher profits
      </motion.p>

      {/* Loading dots */}
      <motion.div
        className="flex gap-2 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
