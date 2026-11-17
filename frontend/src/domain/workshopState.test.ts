import { describe, expect, it } from 'vitest'

import { getWorkshopViewState } from '@/domain/workshopState'

import { makeWorkshop } from '@/test/fixtures'

describe('getWorkshopViewState', () => {
  it('offers registration for an open workshop', () => {
    const state = getWorkshopViewState(makeWorkshop())

    expect(state.state).toBe('available')
    expect(state.canRegister).toBe(true)
    expect(state.canCancel).toBe(false)
    expect(state.action).toBe('register')
    expect(state.availableSeats).toBe(2)
  })

  it('offers cancellation for an active registration', () => {
    const state = getWorkshopViewState(
      makeWorkshop({
        activeRegistrationId: 44,
        lastRegistration: {
          id: 44,
          status: 'active',
          createdAt: '2026-11-16T10:00:00Z',
          cancelledAt: null,
        },
      }),
    )

    expect(state.state).toBe('registered')
    expect(state.isRegistered).toBe(true)
    expect(state.canCancel).toBe(true)
    expect(state.action).toBe('cancel')
  })

  it('prevents registration when every seat is taken', () => {
    const state = getWorkshopViewState(
      makeWorkshop({
        capacity: 1,
        seatsTaken: 1,
        availableSeats: 0,
      }),
    )

    expect(state.state).toBe('full')
    expect(state.isFull).toBe(true)
    expect(state.canRegister).toBe(false)
    expect(state.action).toBe('none')
    expect(state.occupancyPercent).toBe(100)
  })

  it('offers registration again after a cancellation', () => {
    const state = getWorkshopViewState(
      makeWorkshop({
        lastRegistration: {
          id: 45,
          status: 'cancelled',
          createdAt: '2026-11-15T10:00:00Z',
          cancelledAt: '2026-11-16T10:00:00Z',
        },
      }),
    )

    expect(state.state).toBe('cancelled')
    expect(state.canRegister).toBe(true)
    expect(state.action).toBe('register')
  })

  it('clamps inconsistent capacity values instead of rendering negatives', () => {
    const state = getWorkshopViewState(
      makeWorkshop({
        capacity: 2,
        seatsTaken: 5,
        availableSeats: -3,
      }),
    )

    expect(state.occupiedSeats).toBe(2)
    expect(state.availableSeats).toBe(0)
    expect(state.occupancyPercent).toBe(100)
    expect(state.isFull).toBe(true)
  })
})
