import { createContext, useContext } from 'react'

import { messages, type MessageKey } from './messages'
import type { Direction, Locale } from './types'

export type TranslationParams = Readonly<Record<string, string | number>>

export type Translate = (
  key: MessageKey,
  params?: TranslationParams,
) => string

export interface I18nContextValue {
  locale: Locale
  dir: Direction
  setLocale: (locale: Locale) => void
  t: Translate
}

export function interpolate(
  template: string,
  params?: TranslationParams,
): string {
  if (!params) {
    return template
  }

  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name]
    return value === undefined ? match : String(value)
  })
}

export function translateWith(
  locale: Locale,
  key: MessageKey,
  params?: TranslationParams,
): string {
  return interpolate(messages[locale][key], params)
}

const defaultContext: I18nContextValue = {
  locale: 'en',
  dir: 'ltr',
  setLocale: () => undefined,
  t: (key, params) => translateWith('en', key, params),
}

export const I18nContext = createContext<I18nContextValue>(defaultContext)

export function useI18n(): I18nContextValue {
  return useContext(I18nContext)
}
