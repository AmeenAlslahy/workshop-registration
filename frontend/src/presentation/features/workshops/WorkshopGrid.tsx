import { InlineNotice } from '@/presentation/components/InlineNotice/InlineNotice'
import { Spinner } from '@/presentation/components/Spinner/Spinner'
import { describeError } from '@/presentation/i18n/describeError'
import { useI18n } from '@/presentation/i18n/i18nContext'

import { WorkshopCard } from './WorkshopCard'
import type {
  ActionFeedback,
  PendingAction,
  WorkshopItem,
} from './types'
import styles from './WorkshopGrid.module.css'

interface WorkshopGridProps {
  items: readonly WorkshopItem[]
  isBusy: boolean
  isRefreshing: boolean
  pendingAction: PendingAction | null
  feedbackByWorkshop: ReadonlyMap<number, ActionFeedback>
  refreshError: unknown
  onRegister: (workshopId: number) => void
  onCancel: (workshopId: number, registrationId: number) => void
  onDismissFeedback: () => void
}

export function WorkshopGrid({
  items,
  isBusy,
  isRefreshing,
  pendingAction,
  feedbackByWorkshop,
  refreshError,
  onRegister,
  onCancel,
  onDismissFeedback,
}: WorkshopGridProps) {
  const { t } = useI18n()
  const openWorkshops = items.filter((item) => !item.state.isFull).length

  return (
    <section className={styles.section} aria-labelledby="workshops-title">
      <div className={styles.headingRow}>
        <div>
          <h2 className={styles.title} id="workshops-title">
            {t('workshops.title')}
          </h2>
          <p className={styles.summary}>
            {t('workshops.meta', {
              count: items.length,
              open: openWorkshops,
            })}
          </p>
        </div>
        {isRefreshing ? (
          <span className={styles.refreshing}>
            <Spinner size="sm" />
            {t('workshops.refreshing')}
          </span>
        ) : null}
      </div>

      {refreshError ? (
        <InlineNotice
          tone="error"
          title={t('workshops.refreshErrorTitle')}
          message={describeError(refreshError, t)}
        />
      ) : null}

      <div className={styles.grid}>
        {items.map(({ workshop, state }) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            viewState={state}
            isBusy={isBusy}
            pendingAction={pendingAction}
            feedback={feedbackByWorkshop.get(workshop.id)}
            onRegister={() => onRegister(workshop.id)}
            onCancel={() => {
              if (workshop.activeRegistrationId !== null) {
                onCancel(workshop.id, workshop.activeRegistrationId)
              }
            }}
            onDismissFeedback={onDismissFeedback}
          />
        ))}
      </div>
    </section>
  )
}
