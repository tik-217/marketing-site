import { Helmet } from 'react-helmet-async'
import { contacts } from '../../../shared/config/contacts'
import { CtaButton } from '../../../shared/ui'
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
          <h1 className="hero__headline">Приведу юридической фирме первые заявки из Яндекса за месяц, а сайт и рекламный кабинет останутся у вас</h1>
          <p className="hero__lead">
            Сначала разбираю спрос и конкурентов в вашей нише, потом собираю сайт и рекламу по итогам анализа. В последнем проекте одна сделка окупила маркетинг в 11 раз.
          </p>
          <div className="hero__cta">
            <CtaButton source="s-hero" />
            <p className="hero__help">Бесплатно. Откроется чат со мной в Telegram, отвечу в течение 30 минут</p>
            <p className="hero__help hero__direct">
              Или позвоните: <a href="tel:+79180220901">{contacts.phone}</a>
            </p>
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
