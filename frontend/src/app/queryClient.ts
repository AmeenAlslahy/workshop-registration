import { QueryClient } from '@tanstack/react-query'

import { isApiError } from '@/domain/apiError'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // إعادة جلب قبل 15 ثانية
      staleTime: 15_000,
      // — مدة بقاء البيانات في الذاكرة بعد توقف استخدامها
      gcTime: 5 * 60_000,
      // لا نريد طلبًا كلما رجع المستخدم للتبويب
      refetchOnWindowFocus: false,
      // محاولة واحدة فقط، وفقط إذا كان الخطأ ApiError وقابلًا للإعادة (network / timeout / 5xx).
      retry: (failureCount, error) =>
        failureCount < 1 && isApiError(error) && error.isRetryable,
    },
    // لا نكرر تسجيلًا أو إلغاءً تلقائيًا أبدًا (خطر التكرار).
    mutations: {
      retry: false,
    },
  },
})
