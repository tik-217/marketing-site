import { CtaButton, Section } from '../../../shared/ui'
import { boundaries } from '../model/boundaries'

export function Boundaries() {
  return (
    <Section containerClassName="stack stack--tight">
      <h2 className="section-heading">Скажу сразу, когда работать не буду</h2>
      <ul className="boundaries-list">
        {boundaries.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <CtaButton className="boundaries-cta" />
    </Section>
  )
}
