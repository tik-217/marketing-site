import { Section } from '../../../shared/ui'
import { boundaries } from '../model/boundaries'

export function Boundaries() {
  return (
    <Section containerClassName="stack stack--tight">
      <h2 className="section-heading">Не берусь, если</h2>
      <ul className="boundaries-list">
        {boundaries.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Section>
  )
}
