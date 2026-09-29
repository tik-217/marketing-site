import { Link } from 'react-router-dom'

export function CasePreviewCard({
  slug,
  title,
  cover,
  orderedService,
  status,
  description,
  TitleTag = 'h3',
}) {
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
        <div className="case-preview-card__top">
          <span className="case-badge">{orderedService}</span>
          <span className="case-status">
            <span className={status === 'done' ? 'case-status__dot case-status__dot--done' : 'case-status__dot'} />
            {status === 'done' ? 'Завершен' : 'В работе'}
          </span>
        </div>
        <TitleTag className="case-preview-card__title">{title}</TitleTag>
        <p className="case-preview-card__summary">{description}</p>
      </div>
    </Link>
  )
}
