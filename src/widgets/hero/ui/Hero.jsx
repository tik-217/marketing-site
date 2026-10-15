import { Helmet } from 'react-helmet-async'
import { contacts } from '../../../shared/config/contacts'
import { CtaButton } from '../../../shared/ui'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'

/** Главный экран: текст слева, крупный черно-белый портрет справа, фон однотонный. */
export function Hero() {
  return (
    <section className="hero">
      <Helmet>
        <link rel="preload" as="image" type="image/avif" href={portrait} />
      </Helmet>
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__headline">Приведу юридической фирме первые заявки из Яндекса за месяц, а сайт и рекламный кабинет останутся у вас</h1>
          <p className="hero__lead">
            Сначала разбираю спрос и конкурентов в вашей нише, потом собираю сайт и рекламу по итогам анализа. В последнем проекте одна сделка окупила маркетинг в 11 раз.
          </p>
          <div className="hero__cta">
            <CtaButton source="s-hero" />
            <p className="hero__help">Бесплатно, пять вопросов в Telegram-боте</p>
            <p className="hero__help hero__direct">
              Или напишите напрямую: <a href="tel:+79180220901">{contacts.phone}</a> ·{' '}
              <a href={contacts.telegramUrl} target="_blank" rel="noopener noreferrer">Telegram</a>
            </p>
          </div>
        </div>
        <img src={portrait} alt="Габулян Тигран" className="hero__portrait" fetchPriority="high" decoding="async" />
      </div>
    </section>
  )
}
