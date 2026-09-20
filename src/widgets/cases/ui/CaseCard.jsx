import { CaseSlider } from './CaseSlider'

export function CaseCard({ title, slides, description, meta }) {
  return (
    <article className="case-card">
      <h3 className="case-card__title">{title}</h3>
      <CaseSlider slides={slides} />
      <div className="case-card__copy">
        <p className="case-card__description">{description}</p>
      </div>
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
