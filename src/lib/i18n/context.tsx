'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ar } from './ar';
import { en } from './en';
import { hi } from './hi';

type TranslationValue = string | { dir: string; lang: string };
type Translations = Record<string, TranslationValue | Record<string, TranslationValue | Record<string, TranslationValue>>>;

export type Locale = 'ar' | 'en' | 'hi';

const translations: Record<Locale, Translations> = { ar, en, hi };

type Direction = 'rtl' | 'ltr';

const validLocales: Locale[] = ['ar', 'en', 'hi'];

function getSavedLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('delegate-locale') as Locale | null;
    if (saved && validLocales.includes(saved)) {
      return saved;
    }
  }
  return 'ar';
}

function getDirection(l: Locale): Direction {
  return l === 'ar' ? 'rtl' : 'ltr';
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: Direction;
  t: Translations;
  toggleDirection: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale);

  const dir = getDirection(locale);
  const t = translations[locale];

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('delegate-locale', newLocale);
    document.documentElement.dir = getDirection(newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, []);

  const toggleDirection = useCallback(() => {
    const currentIndex = validLocales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % validLocales.length;
    setLocale(validLocales[nextIndex]);
  }, [locale, setLocale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, dir, t, toggleDirection }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
