export type RegistrationStatus = 'active' | 'cancelled'

export interface RegistrationSummary {
  readonly id: number
  readonly status: RegistrationStatus
  readonly createdAt: string
  readonly cancelledAt: string | null
}

export interface RegistrationResult {
  readonly message: string
  readonly registrationId: number
}

export interface CancellationResult {
  readonly message: string
}
