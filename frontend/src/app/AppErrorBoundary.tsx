import { Component, type ErrorInfo, type ReactNode } from 'react'

import { Button } from '@/presentation/components/Button/Button'
import { StatePanel } from '@/presentation/components/StatePanel/StatePanel'
import { useI18n } from '@/presentation/i18n/i18nContext'

import styles from './AppErrorBoundary.module.css'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

function AppErrorFallback() {
  const { t } = useI18n()

  return (
    <main className={styles.fallback}>
      <div className={styles.panel}>
        <StatePanel
          tone="error"
          icon="alert"
          title={t('error.boundaryTitle')}
          description={t('error.boundaryBody')}
          action={
            <Button
              variant="primary"
              onClick={() => {
                globalThis.location.reload()
              }}
            >
              {t('error.boundaryAction')}
            </Button>
          }
        />
      </div>
    </main>
  )
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled application error', error, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <AppErrorFallback />
    }

    return this.props.children
  }
}
