import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const defaultContext: ThemeContextValue = {
  theme: 'light',
  setTheme: () => undefined,
  toggleTheme: () => undefined,
}

export const ThemeContext = createContext<ThemeContextValue>(defaultContext)

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
