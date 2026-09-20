import { useState } from 'react'
import { CtaButton, Section } from '../../../shared/ui'
import { comparisonOptions } from '../model/comparisonOptions'
import { ComparisonPanel } from './ComparisonPanel'

export function Comparison() {
  const [active, setActive] = useState('mine')

  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Три способа получить заявки и что остается у вас после каждого</h2>

      <div className="tabs comparison-tabs">
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

      <p style={{ color: 'var(--text-secondary)', maxWidth: '58ch' }}>
        Когда рекламу настраивает один человек, сайт делает второй, а тексты пишет третий, каждый
        отвечает за свой кусок и никто за результат целиком. Сайт не знает, что обещает реклама,
        реклама ведет на страницу, которая говорит о другом.
      </p>

      <CtaButton className="comparison-cta" />
    </Section>
  )
}
