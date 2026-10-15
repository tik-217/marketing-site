import { CtaButton, Section } from '../../../shared/ui'
import { comparisonOptions } from '../model/comparisonOptions'
import { ComparisonPanel } from './ComparisonPanel'

export function Comparison() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Четыре способа получить заявки и что остается у вас после каждого</h2>

      <div className="comparison-grid">
        {comparisonOptions.map((option) => (
          <ComparisonPanel key={option.id} {...option} />
        ))}
      </div>

      <CtaButton className="comparison-cta" source="s-paths" />
    </Section>
  )
}
