import { Link } from 'react-router-dom'
import { CaseSlider } from './CaseSlider'

export function CaseCard({ slug, title, slides, description, resultText, status }) {
  const inProgress = status !== 'done'

  return (
    <article className="case-card">
      <h3 className="case-card__title">{title}</h3>
      <CaseSlider slides={slides} />
      <div className="case-card__copy">
        <p className="case-card__description">{description}</p>
        {resultText && (
          <div className="case-card__result">
            <span className="case-card__result-label">{inProgress ? 'Промежуточный результат' : 'Результат'}</span>
            <p className="case-card__result-text">{resultText}</p>
          </div>
        )}
      </div>
      {slug && (
        <Link to={`/cases/${slug}`} className="case-card__link">
          Читать кейс <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  )
}
