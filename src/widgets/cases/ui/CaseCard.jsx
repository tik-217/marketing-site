import { useId, useState } from 'react'

export function CaseCard({ title, image, description, details, meta }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = useId()
  const toggleDetails = () => setIsExpanded((current) => !current)

  const handleDetailsKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleDetails()
    }
  }

  return (
    <article className="case-card">
      <h3 className="case-card__title">{title}</h3>
      <img src={image} alt={title} className="case-card__image" />
      <div className="case-card__copy">
        <p className="case-card__description">{description}</p>
        {details && (
          <div className="case-card__expandable">
            <div
              className={`case-card__details${isExpanded ? '' : ' is-collapsed'}`}
              id={detailsId}
              role="button"
              tabIndex={0}
              aria-label={isExpanded ? 'Свернуть подробности' : 'Развернуть подробности'}
              aria-expanded={isExpanded}
              onClick={toggleDetails}
              onKeyDown={handleDetailsKeyDown}
            >
              {details.map((paragraph) => (
                <p className="case-card__description" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
            <button
              type="button"
              className="case-card__details-button"
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              onClick={toggleDetails}
            >
              {isExpanded ? 'СВЕРНУТЬ' : 'ПОДРОБНЕЕ'}
              <span className="case-card__details-button-icon" aria-hidden="true">
                {isExpanded ? '×' : '+'}
              </span>
            </button>
          </div>
        )}
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
