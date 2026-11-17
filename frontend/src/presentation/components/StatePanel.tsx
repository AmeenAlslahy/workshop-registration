import type { ReactNode } from 'react'

import { cx } from '@/shared/utils/classNames'

import { Icon, type IconName } from './Icon'
import styles from './StatePanel.module.css'

interface StatePanelProps {
  icon: IconName
  title: string
  description: string
  tone?: 'neutral' | 'error'
  action?: ReactNode
}

export function StatePanel({
  icon,
  title,
  description,
  tone = 'neutral',
  action,
}: StatePanelProps) {
  return (
    <section
      className={cx(styles.panel, tone === 'error' && styles.error)}
      role={tone === 'error' ? 'alert' : undefined}
    >
      <span className={styles.icon}>
        <Icon name={icon} size={24} />
      </span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {action ? <div className={styles.action}>{action}</div> : null}
    </section>
  )
}
