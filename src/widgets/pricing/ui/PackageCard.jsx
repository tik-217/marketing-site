export function PackageCard({ title, price, priceSuffix, items, note, inverse }) {
  return (
    <div className={inverse ? 'package-card package-card--inverse' : 'package-card'}>
      <h4 className="package-card__title">{title}</h4>
      <span className="package-card__price">
        {price}
        {priceSuffix && (
          <>
            <br />
            {priceSuffix}
          </>
        )}
      </span>
      <ul className="package-card__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {note && <p className="package-card__note">{note}</p>}
    </div>
  )
}
