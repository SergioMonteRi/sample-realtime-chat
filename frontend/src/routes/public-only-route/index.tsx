import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/providers'

import { getRedirectPath } from '../routes.utils'

/** Quem ja tem sessao nao volta ao login — segue para onde tentou ir. */
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(location.state)} replace />
  }

  return <Outlet />
}
