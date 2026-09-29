import { ExternalLinkIcon } from '../../../shared/ui'

export function CaseStepImage({ src, srcDark, mobileSrc, alt, caption, docHref, wide }) {
  const picture = srcDark ? (
    <>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="theme-image--light" />
      <img src={srcDark} alt={alt} loading="lazy" decoding="async" className="theme-image--dark" />
    </>
  ) : (
    <picture>
      {mobileSrc && <source media="(max-width: 860px)" srcSet={mobileSrc} />}
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </picture>
  )

  const imageClassName = wide ? 'case-step__image case-step__image--wide' : 'case-step__image'

  if (docHref) {
    return (
      <a href={docHref} target="_blank" rel="noopener noreferrer" className="case-step__image-link" aria-label={`Открыть документ: ${caption || alt}`}>
        <span className={imageClassName}>{picture}</span>
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
        className={imageClassName}
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
