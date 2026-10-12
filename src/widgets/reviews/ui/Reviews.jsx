import { isReviewsVisible, reviewsConfig } from '../../../shared/config/reviews'
import { Section } from '../../../shared/ui'

export function Reviews({ config = reviewsConfig }) {
  if (!isReviewsVisible(config)) return null

  const orgId = encodeURIComponent(String(config.orgId).trim())

  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Эти отзывы клиенты оставили на Яндекс Картах</h2>
      <div className="reviews-card">
        <iframe
          className="reviews-card__frame"
          src={`https://yandex.ru/maps-reviews-widget/${orgId}?comments`}
          title="Отзывы клиентов на Яндекс Картах"
          loading="lazy"
        />
      </div>
      <a
        className="reviews-link"
        href={`https://yandex.ru/maps/org/${orgId}/reviews/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Все отзывы на Яндекс Картах <span aria-hidden="true">→</span>
      </a>
    </Section>
  )
}
