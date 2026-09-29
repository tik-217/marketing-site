import { Link } from 'react-router-dom'
import { cases } from '../../../entities/case'
import { Button, Section } from '../../../shared/ui'
import { CasePreviewCard } from './CasePreviewCard'

export function Cases() {
  return (
    <Section id="cases" containerClassName="stack">
      <h2 className="section-heading">Два юридических проекта, от брифа до результата</h2>
      <div className="case-preview-grid">
        {cases.map((item) => (
          <CasePreviewCard key={item.id} {...item} />
        ))}
      </div>
      <Button as={Link} to="/cases" className="btn--outline" style={{ alignSelf: 'flex-start' }}>
        Все кейсы <span aria-hidden="true">→</span>
      </Button>
    </Section>
  )
}
