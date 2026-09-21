import { Section } from '../../../shared/ui'
import { steps } from '../model/steps'

export function Process() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">От первого разговора до договора три дня</h2>
      <div className="process-list">
        {steps.map((step) => (
          <div className="process-row" key={step.index}>
            <span className="process-row__head">
              <span className="process-row__index">{step.index}</span>
              <span className="process-row__title">{step.title}</span>
            </span>
            <span className="process-row__duration">{step.duration}</span>
            <p className="process-row__desc">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
