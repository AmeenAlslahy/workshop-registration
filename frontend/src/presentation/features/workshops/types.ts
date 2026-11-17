import type { Workshop } from '@/domain/workshop'
import type { WorkshopViewState } from '@/domain/workshopState'

export interface ActionFeedback {
  tone: 'success' | 'error'
  message: string
  workshopId: number
}

export interface PendingAction {
  type: 'register' | 'cancel'
  workshopId: number
}

export interface WorkshopItem {
  workshop: Workshop
  state: WorkshopViewState
}
