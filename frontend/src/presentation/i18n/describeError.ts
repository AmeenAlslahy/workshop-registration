import { isApiError } from '@/domain/apiError'

import type { Translate } from './i18nContext'

/**
 * Presentation-level error copy. Transport errors get a translated fallback;
 * HTTP errors keep the server's specific message (for example "Workshop is
 * full.") because it is more useful than a generic status label.
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
      return error.status !== null && error.status >= 500
        ? t('error.server')
        : error.message
    case 'aborted':
      return t('error.unexpected')
  }
}
