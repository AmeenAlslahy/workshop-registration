import { AppErrorBoundary } from '@/app/AppErrorBoundary'
import { AppProviders } from '@/app/AppProviders'
import { WorkshopRegistrationPage } from '@/presentation/pages/WorkshopRegistrationPage'

export default function App() {
  return (
    <AppProviders>
      <AppErrorBoundary>
        <WorkshopRegistrationPage />
      </AppErrorBoundary>
    </AppProviders>
  )
}
