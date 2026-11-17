import type { RegistrationSummary } from './registration'

export interface Workshop {
  readonly id: number
  readonly title: string
  readonly description: string
  readonly capacity: number
  readonly seatsTaken: number
  readonly availableSeats: number
  readonly activeRegistrationId: number | null
  readonly lastRegistration: RegistrationSummary | null
}
