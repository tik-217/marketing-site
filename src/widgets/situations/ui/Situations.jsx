import { Link } from 'react-router-dom'
import { CtaButton, Section } from '../../../shared/ui'
import { situations } from '../model/situations'

export function Situations() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">С чем ко мне приходят юридические фирмы</h2>
      <div className="situations-grid">
        {situations.map((item) => (
          <div className="situation-card" key={item.id}>
            <h3 className="situation-card__title">{item.title}</h3>
            <p className="situation-card__description">{item.description}</p>
            {item.auditLink && (
              <Link to="/audit" className="situation-card__link">
                Проверить свой сайт за 30 секунд <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        ))}
      </div>
      <CtaButton source="s-situations" style={{ alignSelf: 'flex-start' }} />
    </Section>
  )
}
