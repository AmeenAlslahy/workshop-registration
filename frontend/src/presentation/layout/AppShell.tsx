import type { ReactNode } from 'react'
import { BrandMark } from '@/presentation/components/BrandMark/BrandMark'
import { useI18n } from '@/presentation/i18n/i18nContext'

import { HeaderControls } from './HeaderControls'
import styles from './AppShell.module.css'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { t } = useI18n()

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label={t('brand.name')}>
          <BrandMark />
          <span className={styles.brandCopy}>
            <span className={styles.brandName}>{t('brand.name')}</span>
            <span className={styles.brandTag}>{t('brand.tagline')}</span>
          </span>
        </a>
        <HeaderControls />
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span>{t('footer.serverTruth')}</span>
        <span>{t('footer.stack')}</span>
      </footer>
    </div>
  )
}
