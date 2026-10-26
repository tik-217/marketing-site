import { Link } from 'react-router-dom'

/** Карточка кейса: одно превью на весь верх, ниша, заголовок и кнопка. Вся карточка ведет на страницу кейса. */
export function CasePreviewCard({ slug, title, pageTitle, eyebrow, cover, TitleTag = 'h3' }) {
  return (
    <Link to={`/cases/${slug}`} className="case-preview-card">
      {cover && (
        <img
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          loading="lazy"
          decoding="async"
          className="case-preview-card__cover"
        />
      )}
      <div className="case-preview-card__body">
        <p className="case-preview-card__eyebrow">{eyebrow || title}</p>
        <TitleTag className="case-preview-card__title">{pageTitle || title}</TitleTag>
        <span className="case-preview-card__more">Читать подробнее</span>
      </div>
    </Link>
  )
}
