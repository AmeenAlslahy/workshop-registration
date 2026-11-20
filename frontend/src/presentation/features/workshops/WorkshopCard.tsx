import type { Workshop } from '@/domain/workshop'
import type { WorkshopState, WorkshopViewState } from '@/domain/workshopState'
import { Badge } from '@/presentation/components/Badge/Badge'
import { Button } from '@/presentation/components/Button/Button'
import { CapacityMeter } from '@/presentation/components/CapacityMeter/CapacityMeter'
import { Icon } from '@/presentation/components/Icon/Icon'
import { InlineNotice } from '@/presentation/components/InlineNotice/InlineNotice'
import { useI18n } from '@/presentation/i18n/i18nContext'
import type { MessageKey } from '@/presentation/i18n/messages'
import { formatDateTime } from '@/shared/utils/date'
import { cx } from '@/shared/utils/classNames'

import type { ActionFeedback, PendingAction } from './types'
import styles from './WorkshopCard.module.css'

interface WorkshopCardProps {
  workshop: Workshop
  viewState: WorkshopViewState
  isBusy: boolean
  pendingAction: PendingAction | null
  feedback?: ActionFeedback
  onRegister: () => void
  onCancel: () => void
  onDismissFeedback: () => void
}

// . خريطة حالات الورشة والترجمة
const statusKeyByState: Record<WorkshopState, MessageKey> = {
  registered: 'card.status.registered',
  full: 'card.status.full',
  cancelled: 'card.status.cancelled',
  available: 'card.status.available',
}

function getActionKey(
  state: WorkshopState,
  action: WorkshopViewState['action'],
): MessageKey {
  if (action === 'cancel') {
    return 'card.action.cancel'
  }

  if (action === 'none') {
    return 'card.action.full'
  }

  return state === 'cancelled'
    ? 'card.action.registerAgain'
    : 'card.action.register'
}

// تحديد النص أثناء تنفيذ العملية
function getPendingKey(
  state: WorkshopState,
  pendingType: PendingAction['type'] | null,
): MessageKey {
  if (pendingType === 'cancel') {
    return 'card.pending.cancel'
  }

  return state === 'cancelled'
    ? 'card.pending.reserveAgain'
    : 'card.pending.reserve'
}

export function WorkshopCard({
  workshop,
  viewState,
  isBusy,
  pendingAction,
  feedback,
  onRegister,
  onCancel,
  onDismissFeedback,
}: WorkshopCardProps) {
  const { locale, t } = useI18n()
  // لمعرفة العملية التي يجري تنفيذها حالياً، وعلى أي ورشة
  const pendingHere = pendingAction?.workshopId === workshop.id
  const pendingType = pendingHere ? pendingAction.type : null
  const feedbackId = `workshop-${workshop.id}-feedback`
  const lastRegistration = workshop.lastRegistration

  const historyLabel = lastRegistration
    ? lastRegistration.status === 'active'
      ? t('card.history.registered', {
          date: formatDateTime(lastRegistration.createdAt, locale),
        })
      : t('card.history.cancelled', {
          date: formatDateTime(
            lastRegistration.cancelledAt ?? lastRegistration.createdAt,
            locale,
          ),
        })
    : null

  const statusLabel = t(statusKeyByState[viewState.state])
  const actionLabel = t(getActionKey(viewState.state, viewState.action))
  const pendingLabel = t(getPendingKey(viewState.state, pendingType))

  return (
    <article
      className={cx(styles.card)}
      data-state={viewState.state}
      data-full={viewState.isFull}
      aria-labelledby={`workshop-${workshop.id}-title`}
    >
      <div className={styles.top}>
        <Badge tone={viewState.tone}>{statusLabel}</Badge>
      </div>

      <div className={styles.heading}>
        <h3 className={styles.title} id={`workshop-${workshop.id}-title`}>
          <bdi>{workshop.title}</bdi>
        </h3>
        <p className={styles.description}>
          <bdi>{workshop.description || t('card.descriptionFallback')}</bdi>
        </p>
      </div>

      <CapacityMeter
        occupied={viewState.occupiedSeats}
        capacity={workshop.capacity}
        available={viewState.availableSeats}
        percentage={viewState.occupancyPercent}
      />

      <div className={styles.details}>
        <span className={styles.detail}>
          <Icon name="users" size={15} />
          {t(
            workshop.capacity === 1
              ? 'card.seatsTotal.one'
              : 'card.seatsTotal.other',
            { capacity: workshop.capacity },
          )}
        </span>
        {historyLabel ? (
          <span className={styles.detail}>
            <Icon name="clock" size={15} />
            {historyLabel}
          </span>
        ) : (
          <span className={styles.detail}>
            <Icon name="seat" size={15} />
            {t('card.noRegistration')}
          </span>
        )}
      </div>

      <div className={styles.footer}>
        {feedback ? (
          <InlineNotice
            id={feedbackId}
            tone={feedback.tone}
            message={feedback.message}
            compact
            onDismiss={onDismissFeedback}
          />
        ) : null}

        {viewState.action === 'cancel' ? (
          <Button
            variant="danger"
            fullWidth
            isLoading={pendingType === 'cancel'}
            loadingLabel={pendingLabel}
            disabled={isBusy}
            onClick={onCancel}
            leftIcon={<Icon name="x" size={16} />}
            aria-describedby={feedback ? feedbackId : undefined}
          >
            {actionLabel}
          </Button>
        ) : null}

        {viewState.action === 'register' ? (
          <Button
            variant="primary"
            fullWidth
            isLoading={pendingType === 'register'}
            loadingLabel={pendingLabel}
            disabled={isBusy}
            onClick={onRegister}
            leftIcon={
              <Icon
                name="arrow-right"
                size={16}
                className="directional-icon"
              />
            }
            aria-describedby={feedback ? feedbackId : undefined}
          >
            {actionLabel}
          </Button>
        ) : null}

        {viewState.action === 'none' ? (
          <Button
            variant="secondary"
            fullWidth
            disabled
            leftIcon={<Icon name="lock" size={16} />}
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </article>
  )
}
