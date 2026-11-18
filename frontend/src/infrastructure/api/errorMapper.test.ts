import { describe, expect, it } from 'vitest'

import { toApiError } from './errorMapper'

describe('toApiError', () => {
  it('uses the error message returned by the backend', () => {
    const error = toApiError(409, { error: 'Workshop is full.' })

    expect(error.status).toBe(409)
    expect(error.message).toBe('Workshop is full.')
    expect(error.isConflict).toBe(true)
  })

  it('normalizes DRF field errors into a readable message', () => {
    const error = toApiError(400, {
      participant_id: ['This field is required.'],
    })

    expect(error.message).toBe('This field is required.')
    expect(error.fieldErrors).toEqual({
      participant_id: ['This field is required.'],
    })
  })

  it('supports DRF detail responses', () => {
    const error = toApiError(404, { detail: 'Not found.' })

    expect(error.status).toBe(404)
    expect(error.message).toBe('Not found.')
    expect(error.isNotFound).toBe(true)
  })

  it('falls back to a useful message for non-JSON error pages', () => {
    const error = toApiError(500, '<html>Server error</html>')

    expect(error.message).toBe(
      'The server could not complete the request. Please try again.',
    )
    expect(error.isRetryable).toBe(true)
  })
})
