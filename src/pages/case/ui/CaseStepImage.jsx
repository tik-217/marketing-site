import { ExternalLinkIcon } from '../../../shared/ui'

export function CaseStepImage({ src, mobileSrc, alt, caption, docHref }) {
  const picture = (
    <picture>
      {mobileSrc && <source media="(max-width: 860px)" srcSet={mobileSrc} />}
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </picture>
  )

  if (docHref) {
    return (
      <a href={docHref} target="_blank" rel="noopener noreferrer" className="case-step__image-link" aria-label={`Открыть документ: ${caption || alt}`}>
        <span className="case-step__image">{picture}</span>
        {caption && (
          <span className="case-step__caption">
            {caption}
            <ExternalLinkIcon className="case-step__caption-icon" />
          </span>
        )}
      </a>
    )
  }

  return (
    <figure>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="case-step__image"
        aria-label={`Открыть изображение в полном размере: ${alt}`}
        onClick={(event) => {
          const image = event.currentTarget.querySelector('img')
          if (image?.currentSrc) event.currentTarget.href = image.currentSrc
        }}
      >
        {picture}
      </a>
      {caption && <figcaption className="case-step__caption">{caption}</figcaption>}
    </figure>
  )
}
