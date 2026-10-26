import { Helmet } from 'react-helmet-async'
import { CtaButton } from '../../../shared/ui'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'
import portraitSmall from '../../../shared/assets/images/tigran-portrait-480.avif'

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

/** Портрет справа на первом экране. На телефоне грузится уменьшенная копия. */
export function HeroPortrait() {
  return (
    <>
      <Helmet>
        <link rel="preload" as="image" type="image/avif" href={portraitSmall} media="(max-width: 768px)" />
        <link rel="preload" as="image" type="image/avif" href={portrait} media="(min-width: 769px)" />
      </Helmet>
      <picture>
        <source media="(max-width: 768px)" srcSet={portraitSmall} type="image/avif" />
        <img
          src={portrait}
          alt="Габулян Тигран"
          className="hero__portrait"
          width="606"
          height="808"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
    </>
  )
}

/** Главный экран: текст слева, крупный черно-белый портрет справа, фон однотонный. */
export function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__headline">Приведу вашей юридической фирме клиентов, которые уже ищут юриста в Яндексе</h1>
          <p className="hero__lead">
            В последнем проекте одна сделка окупила маркетинг в 11 раз. Сайт и рекламу собираю под спрос и конкурентов в вашей нише.
          </p>
          <div className="hero__cta">
            <CtaButton source="s-hero" className="btn--wrap" />
            <p className="hero__help">Бесплатно. Выберите практику и город, разбор пришлю в Telegram в тот же день</p>
            <TrustRow />
          </div>
        </div>
        <HeroPortrait />
      </div>
    </section>
  )
}
