import { useEffect, useState } from 'react'

import { useCancelRegistration } from '@/application/mutations/useCancelRegistration'
import { useRegisterForWorkshop } from '@/application/mutations/useRegisterForWorkshop'
import { useParticipantsQuery } from '@/application/queries/useParticipants'
import { useWorkshopsQuery } from '@/application/queries/useWorkshops'
import { isApiError } from '@/domain/apiError'
import { getWorkshopViewState } from '@/domain/workshopState'
import { Button } from '@/presentation/components/Button/Button'
import { Icon } from '@/presentation/components/Icon/Icon'
import { InlineNotice } from '@/presentation/components/InlineNotice/InlineNotice'
import {
  PageSkeleton,
  WorkshopGridSkeleton,
} from '@/presentation/components/Skeleton/Skeleton'
import { StatePanel } from '@/presentation/components/StatePanel/StatePanel'
import { ParticipantSelector } from '@/presentation/features/participants/ParticipantSelector'
import { SessionSummary } from '@/presentation/features/workshops/SessionSummary'
import type {
  ActionFeedback,
  PendingAction,
} from '@/presentation/features/workshops/types'
import { WorkshopGrid } from '@/presentation/features/workshops/WorkshopGrid'
import { describeError } from '@/presentation/i18n/describeError'
import { useI18n } from '@/presentation/i18n/i18nContext'
import { AppShell } from '@/presentation/layout/AppShell'
import { PageHeader } from '@/presentation/layout/PageHeader'
import { useStoredParticipantId } from '@/shared/hooks/useStoredParticipantId'

import styles from './WorkshopRegistrationPage.module.css'

export function WorkshopRegistrationPage() {
  // الترجمه
  const { t } = useI18n()
  // جلب بيانات المشاركين
  const participantsQuery = useParticipantsQuery()
  const [storedParticipantId, setStoredParticipantId] = useStoredParticipantId()
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null)
  // List og Paticipant
  const participants = participantsQuery.data ?? []

  const selectedParticipant =
    participants.find((participant) => participant.id === storedParticipantId) ??
    participants[0] ??
    null

  const participantId = selectedParticipant?.id ?? null

  const workshopsQuery = useWorkshopsQuery(participantId)
  const registerMutation = useRegisterForWorkshop(participantId)
  const cancelMutation = useCancelRegistration(participantId)

  useEffect(() => {
    if (
      selectedParticipant &&
      selectedParticipant.id !== storedParticipantId
    ) {
      setStoredParticipantId(selectedParticipant.id)
    }
  }, [selectedParticipant, storedParticipantId, setStoredParticipantId])

  const isBusy = registerMutation.isPending || cancelMutation.isPending

  const pendingAction: PendingAction | null =
    registerMutation.isPending && registerMutation.variables
      ? {
          type: 'register',
          workshopId: registerMutation.variables.workshopId,
        }
      : cancelMutation.isPending && cancelMutation.variables
        ? {
            type: 'cancel',
            workshopId: cancelMutation.variables.workshopId,
          }
        : null

  const workshops = workshopsQuery.data ?? []
  const items = workshops.map((workshop) => ({
    workshop,
    state: getWorkshopViewState(workshop),
  }))


  const openWorkshops = items.filter((item) => !item.state.isFull).length
  const availableSeats = items.reduce(
    (total, item) => total + item.state.availableSeats,
    0,
  )

  const totalSeats = workshops.reduce(
    (total, workshop) => total + workshop.capacity,
    0,
  )
  const occupancyPercent =
    totalSeats === 0
      ? 0
      : Math.round(((totalSeats - availableSeats) / totalSeats) * 100)

  const feedbackByWorkshop = new Map<number, ActionFeedback>()
  if (feedback) {
    feedbackByWorkshop.set(feedback.workshopId, feedback)
  }

  const handleParticipantChange = (nextParticipantId: number) => {
    if (isBusy) {
      return
    }

    setStoredParticipantId(nextParticipantId)
    setFeedback(null)
  }

  const handleRegister = (workshopId: number) => {
    if (isBusy) {
      return
    }

    setFeedback(null)
    registerMutation.mutate(
      { workshopId },
      {
        onSuccess: (result) => {
          setFeedback({
            tone: 'success',
            workshopId,
            message: result.message,
          })
        },
        onError: (error) => {
          setFeedback({
            tone: 'error',
            workshopId,
            message: describeError(error, t),
          })

          if (isApiError(error) && (error.isConflict || error.isNotFound)) {
            void workshopsQuery.refetch()
          }
        },
      },
    )
  }

  const handleCancel = (workshopId: number, registrationId: number) => {
    if (isBusy) {
      return
    }

    setFeedback(null)
    cancelMutation.mutate(
      { workshopId, registrationId },
      {
        onSuccess: (result) => {
          setFeedback({
            tone: 'success',
            workshopId,
            message: result.message,
          })
        },
        onError: (error) => {
          setFeedback({
            tone: 'error',
            workshopId,
            message: describeError(error, t),
          })

          if (isApiError(error) && (error.isConflict || error.isNotFound)) {
            void workshopsQuery.refetch()
          }
        },
      },
    )
  }

  return (
    <AppShell>
      <PageHeader
        aside={
          <SessionSummary
            openWorkshops={openWorkshops}
            totalWorkshops={items.length}
            availableSeats={availableSeats}
            occupancyPercent={occupancyPercent}
            isLoading={workshopsQuery.isPending}
          />
        }
      />

      {participantsQuery.isPending ? <PageSkeleton /> : null}

      {participantsQuery.isError && participants.length === 0 ? (
        <StatePanel
          tone="error"
          icon="alert"
          title={t('page.participantsErrorTitle')}
          description={describeError(participantsQuery.error, t)}
          action={
            <Button
              variant="primary"
              leftIcon={<Icon name="refresh" size={16} />}
              onClick={() => {
                void participantsQuery.refetch()
              }}
            >
              {t('page.retry')}
            </Button>
          }
        />
      ) : null}

      {!participantsQuery.isPending &&
      !participantsQuery.isError &&
      participants.length === 0 ? (
        <StatePanel
          icon="users"
          title={t('page.participantsEmptyTitle')}
          description={t('page.participantsEmptyBody')}
          action={
            <Button
              variant="secondary"
              leftIcon={<Icon name="refresh" size={16} />}
              onClick={() => {
                void participantsQuery.refetch()
              }}
            >
              {t('page.participantsEmptyAction')}
            </Button>
          }
        />
      ) : null}

      {selectedParticipant ? (
        <div className={styles.page}>
          {participantsQuery.isError && participants.length > 0 ? (
            <InlineNotice
              tone="error"
              title={t('page.participantsStaleTitle')}
              message={describeError(participantsQuery.error, t)}
            />
          ) : null}

          <ParticipantSelector
            participants={participants}
            selectedParticipant={selectedParticipant}
            onSelect={handleParticipantChange}
            disabled={isBusy}
          />

          <div className={styles.workshopSection}>
            {workshopsQuery.isPending ? <WorkshopGridSkeleton /> : null}

            {workshopsQuery.isError && !workshopsQuery.data ? (
              <StatePanel
                tone="error"
                icon="alert"
                title={t('page.workshopsErrorTitle')}
                description={describeError(workshopsQuery.error, t)}
                action={
                  <Button
                    variant="primary"
                    leftIcon={<Icon name="refresh" size={16} />}
                    onClick={() => {
                      void workshopsQuery.refetch()
                    }}
                  >
                    {t('page.retry')}
                  </Button>
                }
              />
            ) : null}

            {workshopsQuery.data && items.length === 0 ? (
              <StatePanel
                icon="calendar"
                title={t('page.workshopsEmptyTitle')}
                description={t('page.workshopsEmptyBody')}
                action={
                  <Button
                    variant="secondary"
                    leftIcon={<Icon name="refresh" size={16} />}
                    onClick={() => {
                      void workshopsQuery.refetch()
                    }}
                  >
                    {t('page.workshopsEmptyAction')}
                  </Button>
                }
              />
            ) : null}

            {items.length > 0 ? (
              <WorkshopGrid
                items={items}
                isBusy={isBusy}
                isRefreshing={
                  workshopsQuery.isFetching && !workshopsQuery.isPending
                }
                pendingAction={pendingAction}
                feedbackByWorkshop={feedbackByWorkshop}
                refreshError={
                  workshopsQuery.isError ? workshopsQuery.error : null
                }
                onRegister={handleRegister}
                onCancel={handleCancel}
                onDismissFeedback={() => setFeedback(null)}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </AppShell>
  )
}
