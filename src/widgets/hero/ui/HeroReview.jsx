import { reviewsConfig } from '../../../shared/config/reviews'

/** Строки доверия под подписью к кнопке первого экрана: отзыв (ссылка на отзывы в профиле на Профи.ру) и образование. */
export function HeroReview() {
  return (
    <>
    <p className="hero__help hero__review">
      <a href={reviewsConfig.profileUrl} target="_blank" rel="noopener noreferrer">
        <span className="hero__review-stars" aria-label="Оценка 5 из 5">★★★★★</span>{' '}
        «Владеет инструментами Я.Директ и нейросетями на профессиональном уровне».{' '}
        <span className="hero__review-author">Андрей, Барс Консалт</span>
      </a>
    </p>
    <p className="hero__help hero__review hero__review--extra">Юридическое образование</p>
    </>
  )
}
