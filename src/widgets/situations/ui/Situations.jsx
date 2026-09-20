import { CtaButton, Section } from '../../../shared/ui'
import { situations } from '../model/situations'

export function Situations() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Помогу с новым направлением или со старой кампанией</h2>
      <div className="situations-grid">
        {situations.map((item) => (
          <div className="situation-card" key={item.id}>
            <h3 className="situation-card__title">{item.title}</h3>
            <p className="situation-card__description">{item.description}</p>
          </div>
        ))}
      </div>
      <CtaButton style={{ alignSelf: 'flex-start' }} />
    </Section>
  )
}
