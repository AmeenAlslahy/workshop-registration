export type ApiErrorKind =
  | 'http'
  | 'network'
  | 'timeout'
  | 'invalid-response'
  | 'aborted'

export type FieldErrors = Readonly<Record<string, readonly string[]>>

interface ApiErrorParams {
  kind: ApiErrorKind
  message: string
  status?: number
  fieldErrors?: FieldErrors
  cause?: unknown
}

/**
 * A single, normalized error type for every failure that can cross the
 * infrastructure boundary. The presentation layer never has to inspect fetch
 * responses or guess at the backend's error shape.
 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null
  readonly fieldErrors: FieldErrors | null

  constructor({ kind, message, status, fieldErrors, cause }: ApiErrorParams) {
    super(message, cause === undefined ? undefined : { cause })
    this.name = 'ApiError'
    this.kind = kind
    this.status = status ?? null
    this.fieldErrors = fieldErrors ?? null
  }

  get isRetryable(): boolean {
    return (
      this.kind === 'network' ||
      this.kind === 'timeout' ||
      (this.status !== null && this.status >= 500)
    )
  }

  get isConflict(): boolean {
    return this.status === 409
  }

  get isNotFound(): boolean {
    return this.status === 404
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
