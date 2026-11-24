/** Строка доверия под кнопкой: три колонки одинаковой ширины, над каждой тонкая линия. Оценка ведет на отзывы на этой же странице. */
export function TrustRow() {
  return (
    <div className="hero-trust">
      <div className="hero-trust__item">
        <span className="hero-trust__title">
          5,0 <span className="hero-trust__star" aria-hidden="true">★</span>
        </span>
        <a href="#reviews" className="hero-trust__caption hero-trust__link">
          оценка на Профи.ру
        </a>
      </div>
      <div className="hero-trust__item">
        <span className="hero-trust__title">Юрист</span>
        <span className="hero-trust__caption">по образованию</span>
      </div>
      <div className="hero-trust__item">
        <span className="hero-trust__title">Сбер</span>
        <span className="hero-trust__caption">в прошлом разработчик</span>
      </div>
    </div>
  )
}

