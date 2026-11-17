import { useI18n } from '@/presentation/i18n/i18nContext'
import { formatPercent } from '@/shared/utils/number'

import styles from './SessionSummary.module.css'

interface SessionSummaryProps {
  openWorkshops: number
  totalWorkshops: number
  availableSeats: number
  occupancyPercent: number
  isLoading?: boolean
}

export function SessionSummary({
  openWorkshops,
  totalWorkshops,
  availableSeats,
  occupancyPercent,
  isLoading = false,
}: SessionSummaryProps) {
  const { locale, t } = useI18n()
  const safePercent = Math.min(100, Math.max(0, occupancyPercent))
  const percentLabel = formatPercent(safePercent, locale)

  return (
    <aside className={styles.panel} aria-label={t('summary.title')}>
      <div className={styles.header}>
        <span className={styles.live}>
          <span className={styles.liveDot} aria-hidden="true" />
          {t('summary.live')}
        </span>
        <span className={styles.percent}>{isLoading ? '—' : percentLabel}</span>
      </div>

      <div className={styles.primary}>
        <span className={styles.value}>{isLoading ? '—' : openWorkshops}</span>
        <span className={styles.primaryCopy}>
          <span className={styles.label}>{t('summary.openWorkshops')}</span>
          <span className={styles.detail}>
            {t('summary.ofTotal', { total: totalWorkshops })}
          </span>
        </span>
      </div>

      <div
        className={styles.track}
        role="progressbar"
        aria-label={t('summary.title')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safePercent}
        aria-valuetext={t('summary.filled', { percent: percentLabel })}
      >
        <span className={styles.fill} style={{ width: `${safePercent}%` }} />
      </div>

      <div className={styles.footer}>
        <span>
          <strong className={styles.available}>{isLoading ? '—' : availableSeats}</strong>{' '}
          {t('summary.seatsAvailable')}
        </span>
        <span>{t('summary.filled', { percent: percentLabel })}</span>
      </div>
    </aside>
  )
}
