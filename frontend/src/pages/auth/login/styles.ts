import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { focusRing } from '@/styles'

export const FooterQuestion = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const FooterLink = styled(Link)`
  ${focusRing};

  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accentStrong};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`
