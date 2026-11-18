import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { WorkshopDto } from '@/infrastructure/api/schemas'
import { WorkshopRegistrationPage } from './WorkshopRegistrationPage'

const participant = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
}

// The mock returns exactly what Django sends: raw snake_case DTOs. The page
// must validate and map them itself, just as it does against the real API.
const openWorkshop: WorkshopDto = {
  id: 10,
  title: 'Django Fundamentals',
  description: 'Introduction to models, views, and URLs.',
  capacity: 3,
  seats_taken: 0,
  available_seats: 3,
  active_registration_id: null,
  last_registration: null,
}

const registeredWorkshop: WorkshopDto = {
  ...openWorkshop,
  seats_taken: 1,
  available_seats: 2,
  active_registration_id: 44,
  last_registration: {
    id: 44,
    status: 'active',
    created_at: '2026-11-16T10:00:00Z',
    cancelled_at: null,
  },
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <WorkshopRegistrationPage />
    </QueryClientProvider>,
  )

  return queryClient
}

describe('WorkshopRegistrationPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('registers a participant and refreshes the card state', async () => {
    const user = userEvent.setup()
    let registered = false

    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url
        const method = init?.method ?? 'GET'

        if (url === '/api/participants/' && method === 'GET') {
          return jsonResponse([participant])
        }

        if (url.startsWith('/api/workshops/?') && method === 'GET') {
          return jsonResponse([
            registered ? registeredWorkshop : openWorkshop,
          ])
        }

        if (
          url === '/api/workshops/10/register/' &&
          method === 'POST'
        ) {
          registered = true
          return jsonResponse(
            { message: 'Registration successful', registration_id: 44 },
            201,
          )
        }

        throw new Error(`Unexpected request: ${method} ${url}`)
      },
    )

    vi.stubGlobal('fetch', fetchMock)
    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Django Fundamentals' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', {
        name: '3 of 3 seats available',
      }),
    ).toHaveAttribute('aria-valuetext', '3 of 3 seats available')

    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(
      await screen.findByRole('button', { name: 'Cancel registration' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Registration successful'),
    ).toBeInTheDocument()
    expect(screen.getByText('Registered')).toBeInTheDocument()

    const registerCall = fetchMock.mock.calls.find(([input]) =>
      String(input).includes('/register/'),
    )
    expect(registerCall).toBeDefined()
    expect(registerCall?.[1]?.headers).toMatchObject({
      'Accept-Language': 'en',
    })
    expect(JSON.parse(String(registerCall?.[1]?.body))).toEqual({
      participant_id: 1,
    })
  })

  it('shows a conflict beside the action and refreshes availability', async () => {
    const user = userEvent.setup()
    let full = false

    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url
        const method = init?.method ?? 'GET'

        if (url === '/api/participants/' && method === 'GET') {
          return jsonResponse([participant])
        }

        if (url.startsWith('/api/workshops/?') && method === 'GET') {
          return jsonResponse([
            full
              ? {
                  ...openWorkshop,
                  seats_taken: 3,
                  available_seats: 0,
                }
              : openWorkshop,
          ])
        }

        if (
          url === '/api/workshops/10/register/' &&
          method === 'POST'
        ) {
          full = true
          return jsonResponse({ error: 'Workshop is full.' }, 409)
        }

        throw new Error(`Unexpected request: ${method} ${url}`)
      },
    )

    vi.stubGlobal('fetch', fetchMock)
    renderPage()

    await screen.findByRole('heading', { name: 'Django Fundamentals' })
    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Workshop is full.',
    )
    expect(
      await screen.findByRole('button', { name: 'Workshop full' }),
    ).toBeDisabled()
  })
})
