import { contacts } from '../../../shared/config/contacts'
import { Button } from '../../../shared/ui'

export function PackageCard({ title, oldPrice, price, items, note, inverse }) {
  return (
    <div className={inverse ? 'package-card package-card--inverse' : 'package-card'}>
      <h4 className="package-card__title">{title}</h4>
      <span className="package-card__price-row">
        {oldPrice && <span className="package-card__old-price">{oldPrice}</span>}
        <span className="package-card__price">{price}</span>
      </span>
      <ul className="package-card__list">
        {items.map((item) =>
          typeof item === 'string' ? (
            <li key={item}>{item}</li>
          ) : (
            <li key={item.label}>
              {item.label}
              <span className="package-card__item-note">{item.note}</span>
            </li>
          ),
        )}
      </ul>
      <Button href="#audit" block className="package-card__cta">
        {contacts.ctaLabel}
      </Button>
      {note && <p className="package-card__note">{note}</p>}
    </div>
  )
}
