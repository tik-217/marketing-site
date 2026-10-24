import { Helmet } from 'react-helmet-async'
import { CtaButton } from '../../../shared/ui'
import { HeroReview } from './HeroReview'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'
import portraitSmall from '../../../shared/assets/images/tigran-portrait-480.avif'

/** Главный экран: текст слева, крупный черно-белый портрет справа, фон однотонный. */
export function Hero() {
  return (
    <section className="hero">
      <Helmet>
        <link rel="preload" as="image" type="image/avif" href={portraitSmall} media="(max-width: 768px)" />
        <link rel="preload" as="image" type="image/avif" href={portrait} media="(min-width: 769px)" />
      </Helmet>
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__headline">Приведу вашей юридической фирме клиентов, которые уже ищут юриста в&nbsp;Яндексе</h1>
          <p className="hero__lead">
            Сначала разбираю спрос и конкурентов в&nbsp;вашей нише, потом собираю сайт и рекламу по итогам анализа. В&nbsp;последнем проекте одна сделка окупила маркетинг в&nbsp;11&nbsp;раз.
          </p>
          <div className="hero__cta">
            <CtaButton source="s-hero" />
            <p className="hero__help">Бесплатно. Напишите город и услугу, остальное посчитаю сам. Отвечу в течение 30 минут</p>
            <HeroReview />
          </div>
        </div>
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
      </div>
    </section>
  )
}
