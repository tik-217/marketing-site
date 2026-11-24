import { Link, useLocation } from 'react-router-dom'
import { Button } from '../../../shared/ui'
import { CaseCardSlider } from './CaseCardSlider'

/**
 * Карточка кейса: ниша, заголовок и кнопка "Читать подробнее". С галереей у стрелок и точек слайдера должны быть
 * настоящие кнопки, поэтому карточка целиком не может быть одной <Link>: растянутой ссылкой становится кнопка
 * (через ::after поверх всего, кроме области слайдера, у нее z-index выше).
 */
export function CasePreviewCard({ slug, title, pageTitle, eyebrow, cover, gallery, previewSummary, TitleTag = 'h3' }) {
  const { pathname } = useLocation()
  const caseUrl = `/cases/${slug}${pathname === '/bankrotstvo' ? '?from=bankrotstvo' : ''}`
  const hasGallery = !previewSummary && gallery && gallery.length > 0

  const body = (
    <div className="case-preview-card__body">
      {(!previewSummary || (eyebrow && eyebrow !== title)) && <p className="case-preview-card__eyebrow">{eyebrow || title}</p>}
      <TitleTag className="case-preview-card__title">{previewSummary ? title : (pageTitle || title)}</TitleTag>
      {hasGallery ? (
        <Button as={Link} to={caseUrl} className="btn--outline case-preview-card__stretched-link case-preview-card__more">
          Читать подробнее
        </Button>
      ) : (
        <span className="btn btn--outline case-preview-card__more">Читать подробнее</span>
      )}
    </div>
  )

  if (hasGallery) {
    return (
      <article className="case-preview-card case-preview-card--gallery">
        <CaseCardSlider slides={gallery} />
        {body}
      </article>
    )
  }

  return (
    <Link to={caseUrl} className="case-preview-card">
      {previewSummary ? (
        <div className="case-summary">
          <div className="case-summary__section case-summary__section--result">
            <span className="case-summary__label">Результат</span>
            <p className="case-summary__result">{previewSummary.result}</p>
          </div>
          <div className="case-summary__section">
            <span className="case-summary__label">{previewSummary.challengeLabel || 'С чем пришел клиент'}</span>
            <p>{previewSummary.challenge}</p>
          </div>
          <div className="case-summary__section">
            <span className="case-summary__label">Решение</span>
            <p>{previewSummary.solution}</p>
          </div>
        </div>
      ) : cover && <img src={cover.src} alt={cover.alt} loading="lazy" decoding="async" className="case-preview-card__cover" />}
      {body}
    </Link>
  )
}
