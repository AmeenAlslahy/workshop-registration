import { z } from 'zod'

import { ApiError } from '@/domain/apiError'

const registrationSummarySchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['active', 'cancelled']),
  created_at: z.string(),
  cancelled_at: z.string().nullable(),
})

const participantSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string(),
})

const workshopSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  capacity: z.number().int().positive(),
  seats_taken: z.number().int().nonnegative(),
  available_seats: z.number().int().nonnegative(),
  active_registration_id: z.number().int().positive().nullable(),
  last_registration: registrationSummarySchema.nullable(),
})

const registerResponseSchema = z.object({
  message: z.string(),
  registration_id: z.number().int().positive(),
})

const cancelResponseSchema = z.object({
  message: z.string(),
})

export type ParticipantDto = z.infer<typeof participantSchema>
export type WorkshopDto = z.infer<typeof workshopSchema>

export const participantListSchema = z.array(participantSchema)
export const workshopListSchema = z.array(workshopSchema)
export { registerResponseSchema, cancelResponseSchema }

export function parseApiPayload<T>(
  schema: z.ZodType<T>,
  payload: unknown,
  resourceName: string,
): T {
  const result = schema.safeParse(payload)

  if (!result.success) {
    throw new ApiError({
      kind: 'invalid-response',
      message: `The server returned an unexpected ${resourceName} response.`,
      cause: result.error,
    })
  }

  return result.data
}
