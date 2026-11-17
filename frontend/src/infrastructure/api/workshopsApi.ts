import type {
  CancellationResult,
  RegistrationResult,
} from '@/domain/registration'
import type { Workshop } from '@/domain/workshop'

import { endpoints } from './endpoints'
import { mapWorkshop } from './mappers'
import { requestJson } from './httpClient'
import {
  cancelResponseSchema,
  parseApiPayload,
  registerResponseSchema,
  workshopListSchema,
} from './schemas'

interface RegisterCommand {
  workshopId: number
  participantId: number
}

interface CancelCommand {
  registrationId: number
  participantId: number
}

export const workshopsApi = {
  async listForParticipant(
    participantId: number,
    signal?: AbortSignal,
  ): Promise<Workshop[]> {
    const payload = await requestJson(endpoints.workshops.list(participantId), {
      signal,
    })
    const dtos = parseApiPayload(workshopListSchema, payload, 'workshop list')
    return dtos.map(mapWorkshop)
  },

  async register(
    { workshopId, participantId }: RegisterCommand,
    signal?: AbortSignal,
  ): Promise<RegistrationResult> {
    const payload = await requestJson(
      endpoints.workshops.register(workshopId),
      {
        method: 'POST',
        body: { participant_id: participantId },
        signal,
      },
    )
    const dto = parseApiPayload(
      registerResponseSchema,
      payload,
      'registration',
    )
    return {
      message: dto.message,
      registrationId: dto.registration_id,
    }
  },

  async cancel(
    { registrationId, participantId }: CancelCommand,
    signal?: AbortSignal,
  ): Promise<CancellationResult> {
    const payload = await requestJson(
      endpoints.registrations.cancel(registrationId),
      {
        method: 'POST',
        body: { participant_id: participantId },
        signal,
      },
    )
    const dto = parseApiPayload(cancelResponseSchema, payload, 'cancellation')
    return { message: dto.message }
  },
}
