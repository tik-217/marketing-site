import { Section } from '../../../shared/ui'
import { questions } from '../model/questions'

export function Faq() {
  return (
    <Section containerClassName="stack stack--tight">
      <h2 className="section-heading">Что спрашивают чаще всего</h2>
      <div className="faq-list">
        {questions.map((item) => (
          <details className="faq-item" key={item.id} open={item.defaultOpen}>
            <summary>
              <span>{item.question}</span>
              <span className="faq-icon">+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
