import { Link } from 'react-router-dom'
import { cases } from '../../../entities/case'
import { Button, Section } from '../../../shared/ui'
import { CasePreviewCard } from './CasePreviewCard'

/** titles заменяет заголовки карточек по id кейса: на /bankrotstvo у легализации свой заголовок. */
export function Cases({ titles = {}, showAllLink = true }) {
  return (
    <Section id="cases" containerClassName="stack">
      <h2 className="section-heading">Кейсы в юридической нише</h2>
      <div className="case-preview-grid">
        {cases.map((item) => (
          <CasePreviewCard key={item.id} {...item} pageTitle={titles[item.id] ?? item.pageTitle} />
        ))}
      </div>
      {showAllLink && (
        <Button as={Link} to="/cases" className="btn--outline" style={{ alignSelf: 'flex-start' }}>
          Все кейсы <span aria-hidden="true">→</span>
        </Button>
      )}
    </Section>
  )
}
