import { Link } from 'react-router-dom'
import { CaseCardSlider } from './CaseCardSlider'

function CaseBadgeRow({ orderedService, status }) {
  return (
    <div className="case-preview-card__top">
      <span className="case-badge">{orderedService}</span>
      <span className="case-status">
        <span className={status === 'done' ? 'case-status__dot case-status__dot--done' : 'case-status__dot'} />
        {status === 'done' ? 'Завершен' : 'В работе'}
      </span>
    </div>
  )
}

function Summary({ description }) {
  if (Array.isArray(description)) {
    return (
      <ul className="case-preview-card__summary case-preview-card__list">
        {description.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    )
  }
  return <p className="case-preview-card__summary">{description}</p>
}

export function CasePreviewCard({
  slug,
  title,
  pageTitle,
  eyebrow,
  cover,
  gallery,
  orderedService,
  status,
  description,
  TitleTag = 'h3',
}) {
  const hasGallery = gallery && gallery.length > 0

  // С галереей у стрелок и точек слайдера должны быть настоящие кнопки, поэтому карточка
  // не может целиком быть одной <Link>. Кликабельным делаем заголовок, растянутый на всю
  // карточку через ::after поверх всего, кроме области слайдера (у нее z-index выше).
  if (hasGallery) {
    return (
      <article className="case-preview-card case-preview-card--gallery">
        <CaseCardSlider slides={gallery} />
        <div className="case-preview-card__body">
          <CaseBadgeRow orderedService={orderedService} status={status} />
          <p className="case-preview-card__eyebrow">{eyebrow || title}</p>
          <TitleTag className="case-preview-card__title">
            <Link to={`/cases/${slug}`} className="case-preview-card__stretched-link">
              {pageTitle || title}
            </Link>
          </TitleTag>
          <Summary description={description} />
        </div>
      </article>
    )
  }

  return (
    <Link to={`/cases/${slug}`} className="case-preview-card" aria-label={title}>
      {cover && (
        <img
          src={cover.src}
          alt={cover.alt}
          loading="lazy"
          decoding="async"
          className="case-preview-card__cover"
        />
      )}
      <div className="case-preview-card__body">
        <CaseBadgeRow orderedService={orderedService} status={status} />
        <p className="case-preview-card__eyebrow">{eyebrow || title}</p>
        <TitleTag className="case-preview-card__title">{pageTitle || title}</TitleTag>
        <Summary description={description} />
      </div>
    </Link>
  )
}
