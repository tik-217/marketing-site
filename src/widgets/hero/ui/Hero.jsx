import { contacts } from '../../../shared/config/contacts'
import { Button, Section } from '../../../shared/ui'
import heroImage from '../../../shared/assets/images/tigran-full.avif'

export function Hero() {
  return (
    <Section flush containerClassName="hero">
      <h1 className="hero__headline">
        Строю канал продаж
        <br />и упаковываю <br />смыслы
      </h1>
      <p className="hero__lead">
        Настраиваю рекламу и собираю сайт на основе маркетингового анализа. Результат — готовая
        воронка с настроенным трафиком
      </p>
      <div className="hero__media">
        <img src={heroImage} alt="Габулян Тигран" className="hero__media-image" />
      </div>
      <div className="hero__cta">
        <Button href="#audit">{contacts.ctaLabel}</Button>
        <p className="hero__help">
          Проведу аудит за 24 часа бесплатно. Посмотрю ваш сайт, рекламу и конкурентов, покажу
          места, где теряется клиенты.
        </p>
      </div>
    </Section>
  )
}
