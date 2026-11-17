import { QueryClient } from '@tanstack/react-query'

import { isApiError } from '@/domain/apiError'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) =>
        failureCount < 1 && isApiError(error) && error.isRetryable,
    },
    mutations: {
      retry: false,
    },
  },
})
