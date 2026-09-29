import { useRef, useState } from 'react'

function Chevron({ direction }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Слайдер обложек на карточке кейса. Живет вне <Link>, чтобы стрелки и точки
// были настоящими кнопками, а не вложенными интерактивными элементами внутри ссылки.
// Переход на страницу кейса делает CasePreviewCard через растянутую ссылку на заголовке.
export function CaseCardSlider({ slides }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const hasControls = slides.length > 1

  function goTo(nextIndex) {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: track.clientWidth * nextIndex, behavior: 'smooth' })
  }

  function handleScroll(event) {
    const track = event.currentTarget
    setIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <div className="case-preview-card__slider">
      <div className="case-preview-card__slider-track" ref={trackRef} onScroll={handleScroll}>
        {slides.map((slide) => (
          <div className="case-preview-card__slide" key={slide.alt}>
            {slide.dark ? (
              <>
                <img src={slide.light} alt={slide.alt} loading="lazy" decoding="async" className="case-preview-card__cover theme-image--light" />
                <img src={slide.dark} alt={slide.alt} loading="lazy" decoding="async" className="case-preview-card__cover theme-image--dark" />
              </>
            ) : (
              <img src={slide.light} alt={slide.alt} loading="lazy" decoding="async" className="case-preview-card__cover" />
            )}
          </div>
        ))}
      </div>
      {hasControls && (
        <>
          <button
            type="button"
            className="case-preview-card__arrow case-preview-card__arrow--prev"
            aria-label="Предыдущее изображение"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            <Chevron direction="prev" />
          </button>
          <button
            type="button"
            className="case-preview-card__arrow case-preview-card__arrow--next"
            aria-label="Следующее изображение"
            disabled={index === slides.length - 1}
            onClick={() => goTo(index + 1)}
          >
            <Chevron direction="next" />
          </button>
          <div className="case-preview-card__dots">
            {slides.map((slide, i) => (
              <button
                key={slide.alt}
                type="button"
                className={i === index ? 'case-preview-card__dot is-active' : 'case-preview-card__dot'}
                aria-label={`Изображение ${i + 1} из ${slides.length}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
