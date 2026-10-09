import { Link } from 'react-router-dom'
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
            Сначала разбираю вашу нишу, клиентов и конкурентов. Потом собираю сайт и рекламу под то, что ищут ваши клиенты. Работаю лично, без менеджера.
          </p>
          <p className="hero__proof">
            Кейс. Фирма по легализации коммерческих объектов, одна сделка окупила маркетинг минимум в 11 раз за три месяца.{' '}
            <Link to="/cases/legalizaciya-kommercheskih-obektov">
              Смотреть кейс <span aria-hidden="true">→</span>
            </Link>
          </p>
          <div className="hero__cta">
            <CtaButton source="s-hero" />
            <p className="hero__help">Бесплатно. Задам пять вопросов в Telegram-боте и пришлю документ с правками.</p>
          </div>
        </div>
        <img src={portrait} alt="Габулян Тигран" className="hero__portrait" fetchPriority="high" decoding="async" />
      </div>
    </section>
  )
}
