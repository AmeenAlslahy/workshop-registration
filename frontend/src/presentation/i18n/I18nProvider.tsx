import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  I18nContext,
  translateWith,
  type I18nContextValue,
  type Translate,
} from './i18nContext'
import type { Direction, Locale } from './types'

const STORAGE_KEY = 'workshop-studio.locale'

function readStoredLocale(): Locale {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY)
    return stored === 'ar' || stored === 'en' ? stored : 'en'
  } catch {
    return 'en'
  }
}

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(readStoredLocale)
  const dir: Direction = locale === 'ar' ? 'rtl' : 'ltr'

  const t = useCallback<Translate>(
    (key, params) => translateWith(locale, key, params),
    [locale],
  )

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = dir
    document.title = t('app.title')

    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, locale)
    } catch {
      // Storage can be unavailable in private or restricted browsing modes.
    }
  }, [locale, dir, t])

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dir, setLocale, t }),
    [locale, dir, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
