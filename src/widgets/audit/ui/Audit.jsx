import { Eyebrow, Section } from '../../../shared/ui'
import { CtaButton } from '../../../features/contact-cta'
import { ContactForm } from './ContactForm'

const defaultCopy = {
  heading: 'Посчитаю, сколько клиентов вашей фирме может дать Яндекс',
  lead: 'Оставьте номер телефона, и я уточню город и услугу. За 24 часа пришлю план с тремя цифрами. Сколько человек в месяц ищут вашу услугу в вашем городе, примерная цена заявки и бюджет на первый месяц. Бесплатно и без обязательств.',
}

const defaultHelp = 'Отвечу в течение 30 минут. План пришлю в течение 2 часов.'

/**
 * Форма для тех, кто не пользуется Telegram. copy меняет тексты блока, cta добавляет кнопку в Telegram,
 * pageName попадает в скрытое поле и в сообщение, чтобы заявки со страницы отличались от заявок с главной.
 */
export function Audit({ id, copy = defaultCopy, help = defaultHelp, cta, pageName }) {
  return (
    <Section id={id} inverse containerClassName="audit">
      <div className="audit__copy">
        <h2 className="audit__heading">{copy.heading}</h2>
        <p className="audit__lead">{copy.lead}</p>
        {cta && <CtaButton source={cta.source} href={cta.href} label={cta.label} className="audit__cta" />}
      </div>

      <ContactForm id={id} btnText={"Получить расчёт бюджета"} help={help} pageName={pageName} />
    </Section>
  )
}
