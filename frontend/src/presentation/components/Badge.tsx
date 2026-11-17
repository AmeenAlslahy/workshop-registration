import type { ReactNode } from 'react'

import { cx } from '@/shared/utils/classNames'

import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone])}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  )
}
