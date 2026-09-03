import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell, AuthLayout } from '@/components/organisms'
import { ROUTES } from '@/constants'
import { ChatPage, LoginPage, NotFoundPage, RegisterPage } from '@/pages'

import { ProtectedRoute } from './protected-route'
import { PublicOnlyRoute } from './public-only-route'

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.root}
        element={<Navigate to={ROUTES.conversations} replace />}
      />

      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.register} element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path={ROUTES.conversations} element={<ChatPage />} />
          <Route path={ROUTES.conversationWithUser} element={<ChatPage />} />
        </Route>
      </Route>

      <Route path={ROUTES.notFound} element={<NotFoundPage />} />
    </Routes>
  )
}
