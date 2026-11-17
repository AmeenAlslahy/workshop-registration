export const queryKeys = {
  participants: ['participants'] as const,
  workshops: (participantId: number) =>
    ['workshops', participantId] as const,
}
