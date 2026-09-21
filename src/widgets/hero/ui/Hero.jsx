import { CtaButton, Section } from '../../../shared/ui'
import heroImage from '../../../shared/assets/images/tigran-full.avif'

export function Hero() {
  return (
    <Section flush containerClassName="hero">
      <h1 className="hero__headline">Собираю маркетинг для юристов, от анализа рынка до заявок</h1>
      <p className="hero__lead">
        Анализ ниши, смыслы, сайт и Яндекс Директ делаю лично я. Домен и рекламный кабинет
        регистрируются на вас и остаются вашими навсегда.
      </p>
      {/* TODO: рядом с фото нужен открытый прототип сайта или экран Директа, материала пока нет. */}
      <div className="hero__media">
        <img src={heroImage} alt="Габулян Тигран" className="hero__media-image" />
      </div>
      <div className="hero__cta">
        <CtaButton />
        <p className="hero__help">
          Задам пять вопросов в Telegram. Пришлю документ с точками потери
          заявок и разберем его на созвоне за 30 минут.
        </p>
      </div>
    </Section>
  )
}
