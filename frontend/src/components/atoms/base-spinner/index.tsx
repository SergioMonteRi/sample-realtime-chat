import { SpinnerRing } from './styles'

type BaseSpinnerProps = {
  size?: number
  label?: string
}

export function BaseSpinner({ size = 14, label }: BaseSpinnerProps) {
  return <SpinnerRing $size={size} role="status" aria-label={label} />
}
