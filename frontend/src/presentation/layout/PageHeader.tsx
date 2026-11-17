import type { ReactNode } from 'react'

import { Icon } from '@/presentation/components/Icon'
import { useI18n } from '@/presentation/i18n/i18nContext'

import styles from './PageHeader.module.css'

interface PageHeaderProps {
  aside?: ReactNode
}

export function PageHeader({ aside }: PageHeaderProps) {
  const { t } = useI18n()

  return (
    <section className={styles.hero} aria-labelledby="page-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
        <h1 className={styles.title} id="page-title">
          {t('hero.titleLine1')}
          <br />
          <em>{t('hero.titleLine2')}</em>
        </h1>
        <p className={styles.lede}>{t('hero.lede')}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Icon name="refresh" size={15} />
            {t('hero.metaLive')}
          </span>
          <span className={styles.metaItem}>
            <Icon name="clock" size={15} />
            {t('hero.metaHistory')}
          </span>
        </div>
      </div>

      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </section>
  )
}
