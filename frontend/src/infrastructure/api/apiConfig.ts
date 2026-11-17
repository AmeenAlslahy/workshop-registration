const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const normalizedBaseUrl = configuredBaseUrl?.replace(/\/+$/, '') ?? ''

export const API_BASE_URL =
  normalizedBaseUrl.length > 0 ? normalizedBaseUrl : '/api'

// زمن الاتصال 
export const REQUEST_TIMEOUT_MS = 12_000
