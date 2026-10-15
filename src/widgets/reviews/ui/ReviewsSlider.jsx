import { useRef, useState } from 'react'

function Chevron({ direction }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Слайдер скриншотов отзывов: свайп, стрелки на компьютере, точки под картинкой. */
export function ReviewsSlider({ slides }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  function slideStep() {
    const track = trackRef.current
    const first = track?.firstElementChild
    const second = first?.nextElementSibling
    if (!first) return 1
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
  }

  function goTo(next) {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: slideStep() * next, behavior: 'smooth' })
  }

  function step(direction) {
    const track = trackRef.current
    if (!track) return
    const current = Math.round(track.scrollLeft / slideStep())
    goTo((current + direction + slides.length) % slides.length)
  }

  function handleScroll(event) {
    setIndex(Math.round(event.currentTarget.scrollLeft / slideStep()))
  }

  return (
    <div className="reviews-slider" role="region" aria-roledescription="слайдер" aria-label="Отзывы клиентов">
      <div className="reviews-slider__frame">
        <div className="reviews-slider__track" ref={trackRef} onScroll={handleScroll}>
          {slides.map((item) => (
            <div className="reviews-slider__slide" key={item.src}>
              <img
                className="reviews-card"
                src={item.src}
                width={item.width}
                height={item.height}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
        <button type="button" className="reviews-slider__arrow reviews-slider__arrow--prev" aria-label="Предыдущий отзыв" onClick={() => step(-1)}>
          <Chevron direction="prev" />
        </button>
        <button type="button" className="reviews-slider__arrow reviews-slider__arrow--next" aria-label="Следующий отзыв" onClick={() => step(1)}>
          <Chevron direction="next" />
        </button>
      </div>
      <div className="reviews-slider__dots">
        {slides.map((item, i) => (
          <button
            key={item.src}
            type="button"
            className={i === index ? 'reviews-slider__dot is-active' : 'reviews-slider__dot'}
            aria-label={`Отзыв ${i + 1} из ${slides.length}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
