import type { Participant } from '@/domain/participant'
import type { RegistrationSummary } from '@/domain/registration'
import type { Workshop } from '@/domain/workshop'

import type { ParticipantDto, WorkshopDto } from './schemas'

export function mapParticipant(dto: ParticipantDto): Participant {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
  }
}

export function mapRegistrationSummary(
  dto: NonNullable<WorkshopDto['last_registration']>,
): RegistrationSummary {
  return {
    id: dto.id,
    status: dto.status,
    createdAt: dto.created_at,
    cancelledAt: dto.cancelled_at,
  }
}

export function mapWorkshop(dto: WorkshopDto): Workshop {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    capacity: dto.capacity,
    seatsTaken: dto.seats_taken,
    availableSeats: dto.available_seats,
    activeRegistrationId: dto.active_registration_id,
    lastRegistration: dto.last_registration
      ? mapRegistrationSummary(dto.last_registration)
      : null,
  }
}
