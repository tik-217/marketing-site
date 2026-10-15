import { isReviewsVisible, reviewsConfig } from '../../../shared/config/reviews'
import { Section } from '../../../shared/ui'
import reviewArtem from '../../../shared/assets/images/review-artem.avif'
import reviewAndrey from '../../../shared/assets/images/review-andrey.avif'

// Скриншоты настоящих отзывов с Яндекс Карт. Размеры файлов 1484x342 и 1484x384.
const reviews = [
  {
    src: reviewArtem,
    width: 1484,
    height: 342,
    alt: 'Отзыв Артема на Яндекс Картах, 5 звезд, 9 октября 2026. Настройка Яндекс.Директ. Все прошло отлично! Будем сотрудничать!',
  },
  {
    src: reviewAndrey,
    width: 1484,
    height: 384,
    alt: 'Отзыв Андрея Барс Консалт на Яндекс Картах, 12 октября 2026. Настройка Яндекс.Директ. Начали работать с Тиграном по 2 проектам компании, специалист внимательный, вежливый, владеет инструментами Я.Директ и нейросетями на профессиональном уровне, есть опыт в разработке, широкий кругозор.',
  },
]

export function Reviews({ config = reviewsConfig }) {
  if (!isReviewsVisible(config)) return null

  const orgId = encodeURIComponent(String(config.orgId).trim())

  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Эти отзывы клиенты оставили на Яндекс Картах</h2>
      <div className="reviews-list">
        {reviews.map((item) => (
          <img
            key={item.src}
            className="reviews-card"
            src={item.src}
            width={item.width}
            height={item.height}
            alt={item.alt}
            loading="lazy"
            decoding="async"
          />
        ))}
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
