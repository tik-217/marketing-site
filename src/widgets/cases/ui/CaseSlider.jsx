import { useRef, useState } from 'react'

function Chevron({ direction }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CaseSlider({ slides }) {
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
    <div className="case-slider">
      <div className="case-slider__track" ref={trackRef} onScroll={handleScroll}>
        {slides.map((slide) => (
          <a
            key={slide.src}
            href={slide.src}
            target="_blank"
            rel="noopener noreferrer"
            className="case-slider__image-link"
            aria-label={`Открыть изображение в полном размере: ${slide.alt}`}
          >
            <img src={slide.src} alt={slide.alt} className="case-slider__slide" loading="lazy" />
          </a>
        ))}
      </div>
      {hasControls && (
        <>
          <button
            type="button"
            className="case-slider__arrow case-slider__arrow--prev"
            aria-label="Предыдущее изображение"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            <Chevron direction="prev" />
          </button>
          <button
            type="button"
            className="case-slider__arrow case-slider__arrow--next"
            aria-label="Следующее изображение"
            disabled={index === slides.length - 1}
            onClick={() => goTo(index + 1)}
          >
            <Chevron direction="next" />
          </button>
          <div className="case-slider__dots">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                className={i === index ? 'case-slider__dot is-active' : 'case-slider__dot'}
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
