import type { Participant } from '@/domain/participant'
import { Icon } from '@/presentation/components/Icon'
import { useI18n } from '@/presentation/i18n/i18nContext'
import { getInitials } from '@/shared/utils/text'

import styles from './ParticipantSelector.module.css'

interface ParticipantSelectorProps {
  participants: readonly Participant[]
  selectedParticipant: Participant
  onSelect: (participantId: number) => void
  disabled?: boolean
}

export function ParticipantSelector({
  participants,
  selectedParticipant,
  onSelect,
  disabled = false,
}: ParticipantSelectorProps) {
  const { t } = useI18n()

  return (
    <section className={styles.panel} aria-labelledby="participant-label">
      <span className={styles.avatar} aria-hidden="true">
        {getInitials(selectedParticipant.name)}
      </span>

      <div className={styles.details}>
        <span className={styles.label} id="participant-label">
          {t('participant.viewingAs')}
        </span>
        <span className={styles.name}>
          <bdi>{selectedParticipant.name}</bdi>
        </span>
        <span className={styles.email}>
          <bdi>{selectedParticipant.email}</bdi>
        </span>
        <span className={styles.hint}>
          {disabled ? t('participant.busyHint') : t('participant.hint')}
        </span>
      </div>

      <div className={styles.selectWrap}>
        <label className="visually-hidden" htmlFor="participant-select">
          {t('participant.choose')}
        </label>
        <select
          id="participant-select"
          className={styles.select}
          value={selectedParticipant.id}
          onChange={(event) => {
            const nextId = Number.parseInt(event.target.value, 10)
            if (Number.isInteger(nextId) && nextId > 0) {
              onSelect(nextId)
            }
          }}
          disabled={disabled}
        >
          {participants.map((participant) => (
            <option key={participant.id} value={participant.id}>
              {participant.name}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={16} className={styles.chevron} />
      </div>
    </section>
  )
}
