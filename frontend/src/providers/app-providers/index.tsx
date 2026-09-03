import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { i18n } from '@/i18n'
import { AuthProvider } from '@/providers/auth-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { setRealtimeGateway, socketIoGateway } from '@/services'
import { GlobalStyles, theme } from '@/styles'

import { createQueryClient } from './query-client'

type AppProvidersProps = {
  children: ReactNode
}

/**
 * Ordem importa: o `AuthProvider` limpa o cache e reage a 401, entao precisa
 * do QueryClient acima dele; o roteador fica por dentro para que as rotas
 * enxerguem a sessao.
 */
export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient)

  useEffect(() => {
    setRealtimeGateway(socketIoGateway)
    socketIoGateway.connect()

    return () => {
      socketIoGateway.disconnect()
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />

        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </AuthProvider>

          <ToastProvider />
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}
