import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { BaseAvatar, BaseButton, BaseIcon } from '@/components/atoms'
import { BrandMark, LanguageSwitch } from '@/components/molecules'

import {
  HeaderActions,
  SessionBlock,
  SessionCopy,
  SessionEmail,
  SessionLabel,
  ShellHeader,
  ShellMain,
  ShellWrapper,
  SignOutLabel,
} from './styles'
import { useAppShell } from './use-app-shell'

export function AppShell() {
  const { t } = useTranslation('auth')
  const { email, displayName, isSigningOut, handleSignOut } = useAppShell()

  return (
    <ShellWrapper>
      <ShellHeader>
        <BrandMark />

        <HeaderActions>
          <LanguageSwitch />

          <SessionBlock>
            <BaseAvatar name={displayName} seed={email} size="sm" />

            <SessionCopy>
              <SessionLabel>{t('session.signedInAs')}</SessionLabel>
              <SessionEmail>{email}</SessionEmail>
            </SessionCopy>
          </SessionBlock>

          <BaseButton
            variant="quiet"
            size="sm"
            onClick={handleSignOut}
            isLoading={isSigningOut}
            aria-label={t('session.signOut')}
          >
            {!isSigningOut && <BaseIcon name="signOut" size={16} />}
            <SignOutLabel>{t('session.signOut')}</SignOutLabel>
          </BaseButton>
        </HeaderActions>
      </ShellHeader>

      <ShellMain>
        <Outlet />
      </ShellMain>
    </ShellWrapper>
  )
}
