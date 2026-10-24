import { Link } from 'react-router-dom'
import { Button } from '../../../shared/ui'
import { CaseCardSlider } from './CaseCardSlider'

/**
 * Карточка кейса: ниша, заголовок и кнопка "Читать подробнее". С галереей у стрелок и точек слайдера должны быть
 * настоящие кнопки, поэтому карточка целиком не может быть одной <Link>: растянутой ссылкой становится кнопка
 * (через ::after поверх всего, кроме области слайдера, у нее z-index выше).
 */
export function CasePreviewCard({ slug, title, pageTitle, eyebrow, cover, gallery, TitleTag = 'h3' }) {
  const hasGallery = gallery && gallery.length > 0

  const body = (
    <div className="case-preview-card__body">
      <p className="case-preview-card__eyebrow">{eyebrow || title}</p>
      <TitleTag className="case-preview-card__title">{pageTitle || title}</TitleTag>
      {hasGallery ? (
        <Button as={Link} to={`/cases/${slug}`} className="btn--outline case-preview-card__stretched-link case-preview-card__more">
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
    <Link to={`/cases/${slug}`} className="case-preview-card" aria-label={title}>
      {cover && <img src={cover.src} alt={cover.alt} loading="lazy" decoding="async" className="case-preview-card__cover" />}
      {body}
    </Link>
  )
}
