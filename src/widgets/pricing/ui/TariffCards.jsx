import { CtaButton } from '../../../shared/ui'

export function CheckIcon({ size = 28 }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" focusable="false">
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

/**
 * Карточки тарифов: один компонент для главной и /bankrotstvo.
 * tariffs: [{ id, name, price, note, items, term, recommended }], getHref(tariff) отдает ссылку кнопки "Выбрать",
 * sourcePrefix дает data-cta вида "<prefix>-<id>".
 */
export function TariffCards({ tariffs, getHref, sourcePrefix }) {
  return (
    <div className="tariffs">
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
                <CheckIcon size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="tariff__term">
            <ClockIcon />
            <span>{tariff.term}</span>
          </p>
          <CtaButton
            source={`${sourcePrefix}-${tariff.id}`}
            href={getHref(tariff)}
            label="Выбрать"
            className={tariff.recommended ? 'tariff__btn' : 'tariff__btn tariff__btn--outline'}
          />
        </article>
      ))}
    </div>
  )
}
