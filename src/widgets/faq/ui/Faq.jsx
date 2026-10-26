import { Section } from '../../../shared/ui'
import { questions as defaultQuestions } from '../model/questions'

/** heading и questions меняют заголовок и вопросы (на /bankrotstvo свои). Раскрыты вопросы с defaultOpen. */
export function Faq({ heading = 'Когда пойдут заявки и что, если реклама уже не сработала', questions = defaultQuestions }) {
  return (
    <Section id="faq" containerClassName="stack stack--tight">
      <h2 className="section-heading">{heading}</h2>
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
