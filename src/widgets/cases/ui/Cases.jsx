import { cases } from '../../../entities/case'
import { Section } from '../../../shared/ui'
import { CaseCard } from './CaseCard'

export function Cases() {
  return (
    <Section id="cases" containerClassName="stack">
      <h2 className="section-heading">Суммарный доход моих клиентов больше 5 млн. руб.</h2>
      <div className="cases-grid">
        {cases.map((item) => (
          <CaseCard key={item.id} {...item} />
        ))}
      </div>
    </Section>
  )
}
