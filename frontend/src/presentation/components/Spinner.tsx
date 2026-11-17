import { cx } from '@/shared/utils/classNames'

import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: 'sm' | 'md'
  className?: string
}

export function Spinner({ size = 'sm', className }: SpinnerProps) {
  return (
    <span
      className={cx(styles.spinner, styles[size], className)}
      aria-hidden="true"
    />
  )
}
