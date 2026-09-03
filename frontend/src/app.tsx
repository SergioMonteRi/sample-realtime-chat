import { ErrorBoundary } from 'react-error-boundary'

import { ErrorFallback } from '@/components/organisms'
import { AppProviders } from '@/providers'
import { AppRoutes } from '@/routes'

export function App() {
  return (
    <AppProviders>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppRoutes />
      </ErrorBoundary>
    </AppProviders>
  )
}
