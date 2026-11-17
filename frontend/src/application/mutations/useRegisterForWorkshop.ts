import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/domain/apiError'
import type { RegistrationResult } from '@/domain/registration'
import { workshopsApi } from '@/infrastructure/api/workshopsApi'

import { queryKeys } from '../queries/queryKeys'

export interface RegisterWorkshopVariables {
  workshopId: number
}

export function useRegisterForWorkshop(participantId: number | null) {
  const queryClient = useQueryClient()

  return useMutation<RegistrationResult, ApiError, RegisterWorkshopVariables>({
    mutationFn: ({ workshopId }) => {
      if (participantId === null) {
        return Promise.reject(
          new ApiError({
            kind: 'http',
            message: 'Select a participant before registering.',
          }),
        )
      }

      return workshopsApi.register({ workshopId, participantId })
    },
    onSuccess: async () => {
      if (participantId !== null) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.workshops(participantId),
        })
      }
    },
  })
}
