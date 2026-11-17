import type { Workshop } from './workshop'

export type WorkshopState = 'registered' | 'cancelled' | 'available' | 'full'

export type WorkshopTone = 'success' | 'warning' | 'danger' | 'neutral'

export type WorkshopAction = 'register' | 'cancel' | 'none'

export interface WorkshopViewState {
  readonly state: WorkshopState
  readonly tone: WorkshopTone
  readonly occupiedSeats: number
  readonly availableSeats: number
  readonly occupancyPercent: number
  readonly isRegistered: boolean
  readonly isFull: boolean
  readonly canRegister: boolean
  readonly canCancel: boolean
  readonly action: WorkshopAction
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Pure domain rule for turning raw API data into the states the UI may show.
 * It returns meaning, never copy: labels are owned by the presentation layer so
 * the same rule works in every language.
 */
export function getWorkshopViewState(workshop: Workshop): WorkshopViewState {
  const capacity = Math.max(0, workshop.capacity)
  const occupiedSeats = clamp(workshop.seatsTaken, 0, capacity)
  const availableSeats = Math.max(0, capacity - occupiedSeats)
  const occupancyPercent =
    capacity === 0 ? 0 : Math.round((occupiedSeats / capacity) * 100)
  const isRegistered = workshop.activeRegistrationId !== null
  const isFull = availableSeats === 0
  const wasCancelled = workshop.lastRegistration?.status === 'cancelled'

  if (isRegistered) {
    return {
      state: 'registered',
      tone: 'success',
      occupiedSeats,
      availableSeats,
      occupancyPercent,
      isRegistered: true,
      isFull,
      canRegister: false,
      canCancel: true,
      action: 'cancel',
    }
  }

  if (isFull) {
    return {
      state: 'full',
      tone: 'danger',
      occupiedSeats,
      availableSeats: 0,
      occupancyPercent: 100,
      isRegistered: false,
      isFull: true,
      canRegister: false,
      canCancel: false,
      action: 'none',
    }
  }

  if (wasCancelled) {
    return {
      state: 'cancelled',
      tone: 'warning',
      occupiedSeats,
      availableSeats,
      occupancyPercent,
      isRegistered: false,
      isFull: false,
      canRegister: true,
      canCancel: false,
      action: 'register',
    }
  }

  return {
    state: 'available',
    tone: 'neutral',
    occupiedSeats,
    availableSeats,
    occupancyPercent,
    isRegistered: false,
    isFull: false,
    canRegister: true,
    canCancel: false,
    action: 'register',
  }
}
