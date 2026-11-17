import { useQuery } from '@tanstack/react-query'

import type { Workshop } from '@/domain/workshop'
import { workshopsApi } from '@/infrastructure/api/workshopsApi'

import { queryKeys } from './queryKeys'

export function useWorkshopsQuery(participantId: number | null) {
  return useQuery<Workshop[]>({
    queryKey: queryKeys.workshops(participantId ?? 0),
    queryFn: ({ signal }) => {
      if (participantId === null) {
        return Promise.resolve([])
      }

      return workshopsApi.listForParticipant(participantId, signal)
    },
    enabled: participantId !== null,
  })
}
