import { ApiError } from '@/domain/apiError'

import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './apiConfig'
import { toApiError } from './errorMapper'
import { getRequestLocale } from './locale'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
  headers?: Readonly<Record<string, string>>
}

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

//  تحويل النص إلى كائن JSON (JSON.parse).
function parseResponseBody(text: string): unknown {
  if (text.trim().length === 0) {
    return undefined
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

// تتحقق مما إذا كان الخطأ الذي حدث هو "إلغاء" وليس خطأ حقيقيًا. (مثلاً: المستخدم أغلق الصفحة قبل أن يكتمل الطلب).
function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

/**
 * One transport for the whole app. It owns URL construction, JSON handling,
 * timeouts, abort propagation, and error normalization. Feature code never
 * calls fetch directly.
 */
export async function requestJson(
  path: string,
  options: RequestOptions = {},
): Promise<unknown> {
  // زر الإيقاف الطارئ". يسمح لنا بإلغاء طلب fetch إذا طال أمده
  const controller = new AbortController()
  // يمثل انتهاء الوقت
  let didTimeout = false

  // إذا مرت 12 ثانية ولم يكتمل الطلب: نغير المتغير didTimeout = true، ثم نضغط زر الإيقاف controller.abort(). هذا يجبر fetch على الفشل فورًا.
  const timeoutId = globalThis.setTimeout(() => {
    didTimeout = true
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  const handleExternalAbort = () => controller.abort()
  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort()
    } else {
      options.signal.addEventListener('abort', handleExternalAbort, {
        once: true,
      })
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Accept-Language': getRequestLocale(),
    ...options.headers,
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(buildUrl(path), {
      method: options.method ?? 'GET',
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
      cache: 'no-store',
    })

    const text = await response.text()
    const payload = parseResponseBody(text)

    if (!response.ok) {
      throw toApiError(response.status, payload)
    }

    if (payload === undefined || typeof payload === 'string') {
      throw new ApiError({
        kind: 'invalid-response',
        status: response.status,
        message: 'The server returned an unreadable response.',
      })
    }

    return payload
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (options.signal?.aborted) {
      throw error
    }

    if (didTimeout) {
      throw new ApiError({
        kind: 'timeout',
        message: 'The request took too long. Please try again.',
        cause: error,
      })
    }

    if (isAbortError(error)) {
      throw error
    }

    throw new ApiError({
      kind: 'network',
      message:
        'Cannot reach the workshop service. Make sure the Django server is running.',
      cause: error,
    })
  } finally {
    globalThis.clearTimeout(timeoutId)
    options.signal?.removeEventListener('abort', handleExternalAbort)
  }
}
