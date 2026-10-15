import { isReviewsVisible, reviewsConfig } from '../../../shared/config/reviews'
import { Section } from '../../../shared/ui'

// Настоящие отзывы с Профи.ру, тексты без правок. Строка "Стоимость работ" и сумма из отзыва не показываются.
const reviews = [
  {
    name: 'Андрей Барс Консалт',
    date: '12 октября 2026',
    rating: 5,
    tag: 'Настройка Яндекс.Директ',
    text: 'Начали работать с Тиграном по 2 проектам компании - специалист внимательный, вежливый, владеет инструментами Я.Директ и нейросетями на профессиональном уровне, есть опыт в разработке, широкий кругозор.',
  },
  {
    name: 'Артем',
    date: '9 октября 2026',
    rating: 5,
    tag: 'Настройка Яндекс.Директ',
    text: 'Все прошло отлично! Будем сотрудничать!',
  },
]

function Stars({ rating }) {
  const label = `Оценка ${String(rating).replace('.', ',')} из 5`
  return (
    <span className="review-card__stars" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, rating - (n - 1)))
        return (
          <span className="review-card__star" key={n} style={{ '--fill': `${fill * 100}%` }} aria-hidden="true">
            ★
          </span>
        )
      })}
    </span>
  )
}

export function Reviews({ config = reviewsConfig }) {
  if (!isReviewsVisible(config)) return null

  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Эти отзывы клиенты оставили на Профи.ру</h2>
      <div className="reviews-grid">
        {reviews.map((item) => (
          <figure className="review-card" key={item.name}>
            <div className="review-card__top">
              <Stars rating={item.rating} />
              <span className="review-card__date">{item.date}</span>
            </div>
            <figcaption className="review-card__name">{item.name}</figcaption>
            <span className="review-card__tag">{item.tag}</span>
            <blockquote className="review-card__text">{item.text}</blockquote>
          </figure>
        ))}
      </div>
      <a
        className="reviews-link"
        href={String(config.profileUrl).trim()}
        target="_blank"
        rel="noopener noreferrer"
      >
        Все отзывы на Профи.ру <span aria-hidden="true">→</span>
      </a>
    </Section>
  )
}
