import { useEffect, useState } from 'react'

const STORAGE_KEY = 'workshop-studio.participant-id'

function readStoredParticipantId(): number | null {
  try {
    const rawValue = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (!rawValue) {
      return null
    }

    const parsed = Number.parseInt(rawValue, 10)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null
  } catch {
    return null
  }
}

export function useStoredParticipantId() {
  const [participantId, setParticipantId] = useState<number | null>(
    readStoredParticipantId,
  )

  useEffect(() => {
    try {
      if (participantId === null) {
        globalThis.localStorage?.removeItem(STORAGE_KEY)
      } else {
        globalThis.localStorage?.setItem(STORAGE_KEY, String(participantId))
      }
    } catch {
      // Storage can be unavailable in private or restricted browsing modes.
    }
  }, [participantId])

  return [participantId, setParticipantId] as const
}
