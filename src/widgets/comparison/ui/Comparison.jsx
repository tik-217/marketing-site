import { useState } from 'react'
import { CtaButton, Section } from '../../../shared/ui'
import { comparisonOptions } from '../model/comparisonOptions'
import { ComparisonPanel } from './ComparisonPanel'

export function Comparison() {
  const [active, setActive] = useState('mine')

  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Четыре способа получить заявки и что остается у вас после каждого</h2>

      <div className="tabs comparison-tabs" role="tablist">
        {comparisonOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={active === option.id ? 'tab is-active' : 'tab'}
            onClick={() => setActive(option.id)}
          >
            {option.tabLabel}
          </button>
        ))}
      </div>

      <div className="comparison-grid">
        {comparisonOptions.map((option) => (
          <ComparisonPanel key={option.id} {...option} isActive={active === option.id} />
        ))}
      </div>

      <CtaButton className="comparison-cta" source="s-paths" />
    </Section>
  )
}
