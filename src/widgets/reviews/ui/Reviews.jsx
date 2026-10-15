import { isReviewsVisible, reviewsConfig } from '../../../shared/config/reviews'
import { Section } from '../../../shared/ui'
import { ReviewsSlider } from './ReviewsSlider'
import reviewArtem from '../../../shared/assets/images/review-artem.avif'
import reviewAndrey from '../../../shared/assets/images/review-andrey.avif'

// Скриншоты настоящих отзывов с Профи.ру. Размеры файлов 1484x342 и 1484x384.
const reviews = [
  {
    src: reviewArtem,
    width: 1484,
    height: 342,
    alt: 'Отзыв Артема на Профи.ру, 5 звезд, 9 октября 2026. Настройка Яндекс.Директ. Все прошло отлично! Будем сотрудничать!',
  },
  {
    src: reviewAndrey,
    width: 1484,
    height: 384,
    alt: 'Отзыв Андрея Барс Консалт на Профи.ру, 12 октября 2026. Настройка Яндекс.Директ. Начали работать с Тиграном по 2 проектам компании, специалист внимательный, вежливый, владеет инструментами Я.Директ и нейросетями на профессиональном уровне, есть опыт в разработке, широкий кругозор.',
  },
]

export function Reviews({ config = reviewsConfig }) {
  if (!isReviewsVisible(config)) return null

  return (
    <Section containerClassName="stack">
      <h2 className="section-heading">Эти отзывы клиенты оставили на Профи.ру</h2>
      <ReviewsSlider slides={reviews} />
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
