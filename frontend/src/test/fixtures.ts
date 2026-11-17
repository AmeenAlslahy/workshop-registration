import type { Participant } from '@/domain/participant'
import type { Workshop } from '@/domain/workshop'

export const participantAlice: Participant = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
}

export const participantBob: Participant = {
  id: 2,
  name: 'Bob Smith',
  email: 'bob@example.com',
}

export function makeWorkshop(overrides: Partial<Workshop> = {}): Workshop {
  return {
    id: 10,
    title: 'Django Fundamentals',
    description: 'Introduction to models, views, and URLs.',
    capacity: 3,
    seatsTaken: 1,
    availableSeats: 2,
    activeRegistrationId: null,
    lastRegistration: null,
    ...overrides,
  }
}
