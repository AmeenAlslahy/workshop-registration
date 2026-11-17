import { cx } from '@/shared/utils/classNames'
import { useI18n } from '@/presentation/i18n/i18nContext'

import { Icon } from './Icon'
import styles from './InlineNotice.module.css'

export type NoticeTone = 'success' | 'error' | 'info'

interface InlineNoticeProps {
  id?: string
  tone: NoticeTone
  message: string
  title?: string
  compact?: boolean
  onDismiss?: () => void
}

const toneIcons = {
  success: 'check',
  error: 'alert',
  info: 'info',
} as const

export function InlineNotice({
  id,
  tone,
  message,
  title,
  compact = false,
  onDismiss,
}: InlineNoticeProps) {
  const { t } = useI18n()

  return (
    <div
      id={id}
      className={cx(styles.notice, styles[tone], compact && styles.compact)}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
    >
      <span className={styles.icon}>
        <Icon name={toneIcons[tone]} size={17} />
      </span>
      <div className={styles.body}>
        {title ? <strong className={styles.title}>{title}</strong> : null}
        <p className={styles.message}>{message}</p>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label={t('notice.dismiss')}
        >
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </div>
  )
}
