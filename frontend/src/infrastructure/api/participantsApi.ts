import type { Participant } from '@/domain/participant'

import { endpoints } from './endpoints'
import { mapParticipant } from './mappers'
import { requestJson } from './httpClient'
import { parseApiPayload, participantListSchema } from './schemas'

export const participantsApi = {
  async list(signal?: AbortSignal): Promise<Participant[]> {
    const payload = await requestJson(endpoints.participants.list(), { signal })
    const dtos = parseApiPayload(
      participantListSchema,
      payload,
      'participant list',
    )
    return dtos.map(mapParticipant)
  },
}
