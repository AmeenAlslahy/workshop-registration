import { ApiError, type FieldErrors } from '@/domain/apiError'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function collectFieldErrors(payload: unknown): FieldErrors | null {
  if (!isRecord(payload)) {
    return null
  }

  const fields: Record<string, string[]> = {}

  for (const [field, value] of Object.entries(payload)) {
    if (field === 'error' || field === 'detail') {
      continue
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      fields[field] = [value]
      continue
    }

    if (
      Array.isArray(value) &&
      value.every((item): item is string => typeof item === 'string')
    ) {
      fields[field] = [...value]
    }
  }

  return Object.keys(fields).length > 0 ? fields : null
}

function findServerMessage(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null
  }

  if (typeof payload.error === 'string' && payload.error.trim().length > 0) {
    return payload.error
  }

  if (isRecord(payload.error)) {
    const nestedMessage = payload.error.message
    if (typeof nestedMessage === 'string' && nestedMessage.trim().length > 0) {
      return nestedMessage
    }
  }

  if (typeof payload.detail === 'string' && payload.detail.trim().length > 0) {
    return payload.detail
  }

  const fieldErrors = collectFieldErrors(payload)
  if (!fieldErrors) {
    return null
  }

  const messages = Object.values(fieldErrors)[0]
  return messages?.[0] ?? null
}

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return 'The request could not be accepted. Please check the values and try again.'
    case 401:
      return 'You are not authorized to perform this action.'
    case 403:
      return 'This action is not allowed.'
    case 404:
      return 'The requested workshop or registration could not be found.'
    case 409:
      return 'That action conflicts with the current availability. Refresh and try again.'
    case 422:
      return 'Some of the submitted values are invalid.'
    case 500:
      return 'The server could not complete the request. Please try again.'
    case 502:
    case 503:
      return 'The workshop service is temporarily unavailable.'
    default:
      return `The request failed with status ${status}.`
  }
}

export function toApiError(status: number, payload: unknown): ApiError {
  return new ApiError({
    kind: 'http',
    status,
    message: findServerMessage(payload) ?? defaultMessageForStatus(status),
    fieldErrors: collectFieldErrors(payload) ?? undefined,
  })
}
