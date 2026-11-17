import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/domain/apiError'
import type { CancellationResult } from '@/domain/registration'
import { workshopsApi } from '@/infrastructure/api/workshopsApi'

import { queryKeys } from '../queries/queryKeys'

export interface CancelRegistrationVariables {
  registrationId: number
  workshopId: number
}

export function useCancelRegistration(participantId: number | null) {
  const queryClient = useQueryClient()

  return useMutation<CancellationResult, ApiError, CancelRegistrationVariables>(
    {
      mutationFn: ({ registrationId }) => {
        if (participantId === null) {
          return Promise.reject(
            new ApiError({
              kind: 'http',
              message: 'Select a participant before cancelling a registration.',
            }),
          )
        }

        return workshopsApi.cancel({ registrationId, participantId })
      },
      onSuccess: async () => {
        if (participantId !== null) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.workshops(participantId),
          })
        }
      },
    },
  )
}
