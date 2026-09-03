import { LabelledRule, PlainRule, RuleLabel } from './styles'

type BaseDividerProps = {
  label?: string
}

export function BaseDivider({ label }: BaseDividerProps) {
  if (!label) return <PlainRule />

  return (
    <LabelledRule role="separator">
      <RuleLabel>{label}</RuleLabel>
    </LabelledRule>
  )
}
