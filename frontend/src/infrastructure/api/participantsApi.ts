import type { Participant } from '@/domain/participant'

import { mapParticipant } from './mappers'
import { requestJson } from './httpClient'
import { parseApiPayload, participantListSchema } from './schemas'

export const participantsApi = {
  async list(signal?: AbortSignal): Promise<Participant[]> {
    const payload = await requestJson('/participants/', { signal })
    const dtos = parseApiPayload(
      participantListSchema,
      payload,
      'participant list',
    )
    return dtos.map(mapParticipant)
  },
}
