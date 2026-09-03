import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { useAuth } from '@/providers'

/**
 * Toda a logica de redirecionamento mora no roteador: nenhuma tela precisa
 * saber se ha sessao para decidir se renderiza.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return <Outlet />
}
