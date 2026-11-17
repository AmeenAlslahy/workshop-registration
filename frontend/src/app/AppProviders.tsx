import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { I18nProvider } from '@/presentation/i18n/I18nProvider'
import { ThemeProvider } from '@/presentation/theme/ThemeProvider'

import { queryClient } from './queryClient'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}
