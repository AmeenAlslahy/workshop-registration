import { useI18n } from '@/presentation/i18n/i18nContext'
import { cx } from '@/shared/utils/classNames'

import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  radius?: string | number
  className?: string
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  className,
}: SkeletonProps) {
  return (
    <span
      className={cx(styles.skeleton, className)}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}

function WorkshopCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <Skeleton width={110} height={26} radius={999} />
      </div>
      <div className={styles.cardBody}>
        <Skeleton width="72%" height={28} />
        <Skeleton height={14} />
        <Skeleton width="88%" height={14} />
      </div>
      <Skeleton height={8} radius={999} />
      <div className={styles.cardFooter}>
        <Skeleton height={42} radius={999} />
      </div>
    </div>
  )
}

export function WorkshopGridSkeleton() {
  const { t } = useI18n()

  return (
    <section
      className={styles.page}
      aria-label={t('a11y.loadingWorkshops')}
      role="status"
    >
      <Skeleton width="34%" height={28} />
      <div className={styles.grid}>
        <WorkshopCardSkeleton />
        <WorkshopCardSkeleton />
        <WorkshopCardSkeleton />
      </div>
      <span className="visually-hidden">
        {t('a11y.loadingWorkshopsText')}
      </span>
    </section>
  )
}

export function PageSkeleton() {
  const { t } = useI18n()

  return (
    <div
      className={styles.page}
      aria-label={t('a11y.loadingPage')}
      role="status"
    >
      <div className={styles.participant}>
        <Skeleton width={54} height={54} radius="50%" />
        <div className={styles.participantBody}>
          <Skeleton width="18%" height={12} />
          <Skeleton width="42%" height={18} />
          <Skeleton width="58%" height={12} />
        </div>
        <Skeleton width={230} height={42} radius={999} />
      </div>
      <WorkshopGridSkeleton />
      <span className="visually-hidden">
        {t('a11y.loadingWorkshopsText')}
      </span>
    </div>
  )
}
