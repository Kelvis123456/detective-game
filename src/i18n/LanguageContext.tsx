import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Locale } from '../types'

const LANGUAGE_STORAGE_KEY = 'detective-game-language'

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return stored === 'en' ? 'en' : 'es'
  } catch {
    return 'es'
  }
}

interface LanguageContextValue {
  locale: Locale
  toggleLocale: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => readStoredLocale())

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale)
    } catch {
      // localStorage unavailable (private mode, disabled cookies) — locale just won't persist
    }
  }, [locale])

  function toggleLocale() {
    setLocale((l) => (l === 'es' ? 'en' : 'es'))
  }

  return <LanguageContext.Provider value={{ locale, toggleLocale }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
