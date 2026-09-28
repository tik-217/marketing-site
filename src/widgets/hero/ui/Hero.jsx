import { CtaButton, Section } from '../../../shared/ui'
import heroImage from '../../../shared/assets/images/tigran-full.avif'

export function Hero() {
  return (
    <Section flush containerClassName="hero">
      <h1 className="hero__headline">Привожу клиентов для юридических ниш через комплексный маркетинг</h1>
      <p className="hero__lead">
          За проект берусь лично я. Изучаю вашу нишу, потом собираю сайт, рекламу и Telegram в одну систему, по которой к вам приходят обращения
      </p>
      {/* TODO: рядом с фото нужен открытый прототип сайта или экран Директа, материала пока нет. */}
      <div className="hero__media">
        <img src={heroImage} alt="Габулян Тигран" className="hero__media-image" />
      </div>
      <div className="hero__cta">
        <CtaButton source="s-hero" />
        <p className="hero__help">
            Бесплатно пришлю документ с правками по сайту и рекламе. Перед этим задам пять вопросов в Telegram-боте.
        </p>
      </div>
    </Section>
  )
}
