import { CtaButton, Section } from '../../../shared/ui'

const contractItems = [
  'Состав работ и срок каждого этапа',
  'Отчет о результатах рекламы каждую неделю',
  'Сайт и рекламный кабинет оформлены на вас',
]

export function Terms() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Что вы получаете по договору</h2>
      <ul className="terms-list">
        {contractItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <CtaButton source="s-terms" style={{ alignSelf: 'flex-start' }} />
    </Section>
  )
}
