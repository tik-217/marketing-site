import { Section } from '../../../shared/ui'

// Заглушка под виджет отзывов Яндекс Карт. Вместо блока вставить iframe, адрес в ссылке подставить.
export function Reviews() {
  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Что говорят клиенты</h2>
      <div
        className="reviews-placeholder"
        dangerouslySetInnerHTML={{ __html: '<!-- сюда вставить iframe отзывов Яндекс Карт -->' }}
      />
      <a className="reviews-link" href="#">
        Все отзывы на Яндекс Картах
      </a>
    </Section>
  )
}
