import { homeTariffs } from '../../../entities/pricing'
import { CtaButton, Section } from '../../../shared/ui'

function CheckIcon() {
  return (
    <svg viewBox="0 0 28 28" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="14" cy="14" r="14" fill="var(--accent)" />
      <path d="M8.5 14.5l3.8 3.8 7.2-7.6" fill="none" stroke="var(--text-on-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4.6V8l2.3 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const tariffHref = (text) => `https://t.me/tigran_front?text=${encodeURIComponent(text.replace(/ /g, ' '))}`

/**
 * Карточки тарифов, общие для главной и /bankrotstvo. Строки названия, цены, пояснения, списка, срока и кнопки
 * стоят на одной линии, поэтому пояснение выводится и тогда, когда его нет. message собирает текст для Telegram.
 */
export function TariffCards({ tariffs, source, message, className = '' }) {
  return (
    <div className={['tariffs', className].filter(Boolean).join(' ')}>
      {tariffs.map((tariff) => (
        <article className={tariff.recommended ? 'tariff tariff--recommended' : 'tariff'} key={tariff.id}>
          <header className="tariff__head">
            <h3 className="tariff__name">{tariff.name}</h3>
            {tariff.recommended && <span className="tariff__badge">Рекомендую</span>}
          </header>
          <p className="tariff__price">{tariff.price}</p>
          <p className="tariff__note">{tariff.note}</p>
          <ul className="tariff__list">
            {tariff.items.map((item) => (
              <li key={item}>
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="tariff__term">
            <ClockIcon />
            <span>{tariff.term}</span>
          </p>
          <CtaButton
            source={`${source}-${tariff.id}`}
            href={tariffHref(message(tariff.name))}
            label="Выбрать"
            className={tariff.recommended ? 'tariff__btn' : 'tariff__btn tariff__btn--outline'}
          />
        </article>
      ))}
    </div>
  )
}

export function Pricing() {
  return (
    <Section id="prices" containerClassName="stack">
      <h2 className="section-heading">Сколько стоит</h2>
      <TariffCards tariffs={homeTariffs} source="s-tariff" message={(name) => `Здравствуйте, интересует тариф ${name}`} />
      <div className="tariffs-note">
        <p>Рекламный бюджет оплачиваете отдельно, на свой кабинет.</p>
        <p>Айдентику, ведение Телеграм-канала, презентации и КП делаю по запросу.</p>
      </div>
    </Section>
  )
}
