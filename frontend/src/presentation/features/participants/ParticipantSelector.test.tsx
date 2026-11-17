import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ParticipantSelector } from './ParticipantSelector'
import { participantAlice, participantBob } from '@/test/fixtures'

describe('ParticipantSelector', () => {
  it('changes the selected participant', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <ParticipantSelector
        participants={[participantAlice, participantBob]}
        selectedParticipant={participantAlice}
        onSelect={onSelect}
      />,
    )

    await user.selectOptions(
      screen.getByLabelText('Choose a participant'),
      '2',
    )

    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('disables switching while an action is pending', () => {
    render(
      <ParticipantSelector
        participants={[participantAlice, participantBob]}
        selectedParticipant={participantAlice}
        onSelect={vi.fn()}
        disabled
      />,
    )

    expect(screen.getByLabelText('Choose a participant')).toBeDisabled()
    expect(
      screen.getByText(/wait for the current action/i),
    ).toBeInTheDocument()
  })
})
