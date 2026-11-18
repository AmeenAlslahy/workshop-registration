import { isApiError } from '@/domain/apiError'

import type { Translate } from './i18nContext'

/**
 * Presentation-level error copy. Transport errors get a translated fallback;
 * HTTP errors keep the server's message because the backend localizes it using
 * the same Accept-Language value the transport sent.
 */
export function describeError(error: unknown, t: Translate): string {
  if (!isApiError(error)) {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message
    }

    return t('error.unexpected')
  }

  switch (error.kind) {
    case 'network':
      return t('error.network')
    case 'timeout':
      return t('error.timeout')
    case 'invalid-response':
      return t('error.invalidResponse')
    case 'http':
      return error.message
    case 'aborted':
      return t('error.unexpected')
  }
}
