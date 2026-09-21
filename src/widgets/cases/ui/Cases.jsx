import { cases } from '../../../entities/case'
import { Section } from '../../../shared/ui'
import { CaseCard } from './CaseCard'

export function Cases() {
  return (
    <Section id="cases" containerClassName="stack">
      <h2 className="section-heading">Два юридических проекта от брифа до первых обращений</h2>
      <div className="cases-grid">
        {cases.map((item) => (
          <CaseCard key={item.id} {...item} />
        ))}
      </div>
    </Section>
  )
}
