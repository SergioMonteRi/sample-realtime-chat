import { Toaster } from 'sonner'

import { ToastStyles } from './styles'

export function ToastProvider() {
  return (
    <>
      <ToastStyles />
      <Toaster
        position="bottom-center"
        duration={4200}
        toastOptions={{ unstyled: true }}
      />
    </>
  )
}
