/**
 * Every backend route the client uses.
 *
 * Keeping them in one module means a route change is a single edit and the list
 * can be compared with the API reference in the README. The values are relative
 * paths; `httpClient` prepends the base URL from `apiConfig`.
 *
 * The trailing slashes are required: Django's URL patterns define them, and a
 * POST to a slashless path would be redirected and lose its body.
 */
export const endpoints = {
  participants: {
    list: (): string => '/participants/',
  },
  workshops: {
    list: (participantId: number): string => {
      const query = new URLSearchParams({
        participant_id: String(participantId),
      })

      return `/workshops/?${query.toString()}`
    },
    register: (workshopId: number): string =>
      `/workshops/${workshopId}/register/`,
  },
  registrations: {
    cancel: (registrationId: number): string =>
      `/registrations/${registrationId}/cancel/`,
  },
}
