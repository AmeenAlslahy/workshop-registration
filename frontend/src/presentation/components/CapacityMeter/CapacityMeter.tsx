import { useI18n } from '@/presentation/i18n/i18nContext'
import { cx } from '@/shared/utils/classNames'
import { formatPercent } from '@/shared/utils/number'

import styles from './CapacityMeter.module.css'

interface CapacityMeterProps {
  occupied: number
  capacity: number
  available: number
  percentage: number
}

export function CapacityMeter({
  occupied,
  capacity,
  available,
  percentage,
}: CapacityMeterProps) {
  const { locale, t } = useI18n()
  const isFull = available === 0
  const safePercentage = Math.min(100, Math.max(0, percentage))
  const percentLabel = formatPercent(safePercentage, locale)
  const seatsText = t(
    capacity === 1 ? 'card.seatsAvailable.one' : 'card.seatsAvailable.other',
    { available, capacity },
  )

  return (
    <div className={cx(styles.meter, isFull && styles.full)}>
      <div className={styles.labels}>
        <span className={styles.available}>{seatsText}</span>
        <span>{t('card.percentFilled', { percent: percentLabel })}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={seatsText}
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={occupied}
        aria-valuetext={seatsText}
      >
        <div
          className={styles.fill}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  )
}
