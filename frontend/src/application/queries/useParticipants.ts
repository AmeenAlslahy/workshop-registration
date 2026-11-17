import { useQuery } from '@tanstack/react-query'

import type { Participant } from '@/domain/participant'
import { participantsApi } from '@/infrastructure/api/participantsApi'

import { queryKeys } from './queryKeys'

export function useParticipantsQuery() {
  return useQuery<Participant[]>({
    queryKey: queryKeys.participants,
    queryFn: ({ signal }) => participantsApi.list(signal),
  })
}
