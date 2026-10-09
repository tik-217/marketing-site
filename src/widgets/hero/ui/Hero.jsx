import { CtaButton } from '../../../shared/ui'
import portrait from '../../../shared/assets/images/tigran-portrait.avif'

/** Главный экран: текст слева, крупный черно-белый портрет справа, фон однотонный. */
export function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__headline">Привожу клиентов юридическим фирмам через сайт и Яндекс Директ</h1>
          <p className="hero__lead">
            Сначала разбираю нишу и конкурентов, потом собираю сайт и рекламу под то, что ищут ваши клиенты.
          </p>
          <div className="hero__cta">
            <CtaButton source="s-hero" />
            <p className="hero__help">Бесплатно, пять вопросов в Telegram-боте</p>
          </div>
        </div>
        <img src={portrait} alt="Габулян Тигран" className="hero__portrait" fetchPriority="high" decoding="async" />
      </div>
    </section>
  )
}
