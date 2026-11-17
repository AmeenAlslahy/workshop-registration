import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { I18nProvider } from '@/presentation/i18n/I18nProvider'
import { ThemeProvider } from '@/presentation/theme/ThemeProvider'

import { AppShell } from './AppShell'

function renderShell() {
  render(
    <I18nProvider>
      <ThemeProvider>
        <AppShell>
          <p>Content</p>
        </AppShell>
      </ThemeProvider>
    </I18nProvider>,
  )
}

describe('AppShell', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.lang = 'en'
    document.documentElement.dir = 'ltr'
    delete document.documentElement.dataset.theme
  })

  it('switches the interface to Arabic and flips the document direction', async () => {
    const user = userEvent.setup()
    renderShell()

    expect(screen.getByText('Workshop Studio')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'العربية' }))

    expect(screen.getByText('استوديو الورش')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(localStorage.getItem('workshop-studio.locale')).toBe('ar')
    expect(
      screen.getByRole('button', { name: 'English' }),
    ).toBeInTheDocument()
  })

  it('toggles between light and dark themes and persists the choice', async () => {
    const user = userEvent.setup()
    renderShell()

    expect(document.documentElement.dataset.theme).toBe('light')

    await user.click(
      screen.getByRole('button', { name: 'Switch to dark mode' }),
    )

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('workshop-studio.theme')).toBe('dark')
    expect(
      screen.getByRole('button', { name: 'Switch to light mode' }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Switch to light mode' }),
    )

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('workshop-studio.theme')).toBe('light')
  })
})
