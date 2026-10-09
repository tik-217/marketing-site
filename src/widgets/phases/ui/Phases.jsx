import { Section } from '../../../shared/ui'
import { phases } from '../model/phases'

export function Phases() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Каждый шаг заканчивается результатом, который можно проверить</h2>
      <div className="phases-grid">
        {phases.map((phase) => (
          <article className="phase-card" key={phase.id}>
            <span className="phase-card__number">{phase.number}</span>
            <h3 className="phase-card__title">
              {phase.title} <span className="phase-card__days">· {phase.days}</span>
            </h3>
            <p className="phase-card__result">{phase.result}</p>
          </article>
        ))}
      </div>
      <p className="phases-note">Полный разбор по шагам, с ценой и сроками, ниже</p>
    </Section>
  )
}
