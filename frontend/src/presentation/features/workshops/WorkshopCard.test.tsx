import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { getWorkshopViewState } from '@/domain/workshopState'
import { WorkshopCard } from '@/presentation/features/workshops/WorkshopCard'
import type {
  ActionFeedback,
  PendingAction,
} from '@/presentation/features/workshops/types'
import { makeWorkshop } from '@/test/fixtures'

interface RenderCardOptions {
  workshop?: ReturnType<typeof makeWorkshop>
  isBusy?: boolean
  pendingAction?: PendingAction | null
  feedback?: ActionFeedback
  onRegister?: () => void
  onCancel?: () => void
  onDismissFeedback?: () => void
}

function renderCard({
  workshop = makeWorkshop(),
  isBusy = false,
  pendingAction = null,
  feedback,
  onRegister = vi.fn(),
  onCancel = vi.fn(),
  onDismissFeedback = vi.fn(),
}: RenderCardOptions = {}) {
  render(
    <WorkshopCard
      workshop={workshop}
      viewState={getWorkshopViewState(workshop)}
      isBusy={isBusy}
      pendingAction={pendingAction}
      feedback={feedback}
      onRegister={onRegister}
      onCancel={onCancel}
      onDismissFeedback={onDismissFeedback}
    />,
  )

  return { onRegister, onCancel, onDismissFeedback }
}

describe('WorkshopCard', () => {
  it('registers an available workshop', async () => {
    const user = userEvent.setup()
    const { onRegister } = renderCard()

    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(onRegister).toHaveBeenCalledOnce()
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '2 of 3 seats available',
    )
  })

  it('cancels an active registration', async () => {
    const user = userEvent.setup()
    const workshop = makeWorkshop({
      activeRegistrationId: 44,
      lastRegistration: {
        id: 44,
        status: 'active',
        createdAt: '2026-11-16T10:00:00Z',
        cancelledAt: null,
      },
    })
    const { onCancel } = renderCard({ workshop })

    expect(screen.getByText('Registered')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: 'Cancel registration' }),
    )

    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('disables the action when the workshop is full', () => {
    renderCard({
      workshop: makeWorkshop({
        capacity: 1,
        seatsTaken: 1,
        availableSeats: 0,
      }),
    })

    expect(
      screen.getByRole('button', { name: 'Workshop full' }),
    ).toBeDisabled()
  })

  it('shows a pending label and blocks repeated submission', () => {
    renderCard({
      isBusy: true,
      pendingAction: { type: 'register', workshopId: 10 },
    })

    const button = screen.getByRole('button', { name: 'Reserving seat…' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('shows backend errors next to the action and allows dismissal', async () => {
    const user = userEvent.setup()
    const { onDismissFeedback } = renderCard({
      feedback: {
        tone: 'error',
        workshopId: 10,
        message: 'Workshop is full.',
      },
    })

    expect(screen.getByRole('alert')).toHaveTextContent('Workshop is full.')

    await user.click(screen.getByRole('button', { name: 'Dismiss message' }))
    expect(onDismissFeedback).toHaveBeenCalledOnce()
  })
})
