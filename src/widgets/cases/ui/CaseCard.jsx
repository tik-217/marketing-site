export function CaseCard({ title, image, description, meta }) {
  return (
    <article className="case-card">
      <h3 className="case-card__title">{title}</h3>
      <img src={image} alt={title} className="case-card__image" />
      <p className="case-card__description">{description}</p>
      <div className="case-card__meta">
        {meta.map((item) =>
          typeof item === 'string' ? (
            <span key={item}>{item}</span>
          ) : (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          ),
        )}
      </div>
    </article>
  )
}
