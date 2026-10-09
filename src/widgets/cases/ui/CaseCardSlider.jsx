import { useRef, useState } from 'react'
import { CropPicture } from '../../../shared/ui'

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
// Зациклен: после последнего слайда «Дальше» ведет к первому, «Назад» с первого — к последнему.
export function CaseCardSlider({ slides }) {
  const trackRef = useRef(null)
  const drag = useRef(null)
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const hasControls = slides.length > 1

  function goToIndex(nextIndex) {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: track.clientWidth * nextIndex, behavior: 'smooth' })
  }

  function step(direction) {
    const track = trackRef.current
    if (!track) return
    // Берем текущую позицию прокрутки напрямую из DOM, а не из React-состояния: при быстрых
    // повторных кликах state может не успеть обновиться между кликами и клики потеряются.
    const current = Math.round(track.scrollLeft / track.clientWidth)
    const next = (current + direction + slides.length) % slides.length
    goToIndex(next)
  }

  // Перелистывание мышью «схватил и потянул». Для тач-экранов работает нативный свайп.
  function handlePointerDown(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const track = trackRef.current
    drag.current = {
      startX: event.clientX,
      startScroll: track.scrollLeft,
      startIndex: Math.round(track.scrollLeft / track.clientWidth),
      startTime: performance.now(),
      moved: false,
    }
  }

  function handlePointerMove(event) {
    const state = drag.current
    if (!state) return
    const track = trackRef.current
    const dx = event.clientX - state.startX
    if (!state.moved && Math.abs(dx) < 4) return
    if (!state.moved) {
      state.moved = true
      setDragging(true)
      track.setPointerCapture(event.pointerId)
    }
    track.scrollLeft = state.startScroll - dx
  }

  function handlePointerEnd() {
    const state = drag.current
    drag.current = null
    if (!state?.moved) return
    const track = trackRef.current
    setDragging(false)
    // Достаточно короткого движения: сдвиг больше ~12% ширины или быстрый рывок листает на один слайд.
    const shift = state.startScroll - track.scrollLeft
    const fast = performance.now() - state.startTime < 300 && Math.abs(shift) > 24
    const direction = Math.abs(shift) > track.clientWidth * 0.12 || fast ? -Math.sign(shift) : 0
    goToIndex(Math.min(slides.length - 1, Math.max(0, state.startIndex + direction)))
  }

  function handleScroll(event) {
    const track = event.currentTarget
    setIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <div className="case-preview-card__slider">
      <div
        className={dragging ? 'case-preview-card__slider-track is-dragging' : 'case-preview-card__slider-track'}
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {slides.map((slide) => (
          <div className="case-preview-card__slide" key={slide.alt}>
            {slide.crop ? (
              <CropPicture src={slide.light} srcDark={slide.dark} alt={slide.alt} crop={slide.crop} className="case-preview-card__crop" draggable={false} />
            ) : slide.dark ? (
              <>
                <img src={slide.light} alt={slide.alt} loading="lazy" decoding="async" draggable={false} className="case-preview-card__cover theme-image--light" />
                <img src={slide.dark} alt={slide.alt} loading="lazy" decoding="async" draggable={false} className="case-preview-card__cover theme-image--dark" />
              </>
            ) : (
              <img src={slide.light} alt={slide.alt} loading="lazy" decoding="async" draggable={false} className="case-preview-card__cover" />
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
            onClick={() => step(-1)}
          >
            <Chevron direction="prev" />
          </button>
          <button
            type="button"
            className="case-preview-card__arrow case-preview-card__arrow--next"
            aria-label="Следующее изображение"
            onClick={() => step(1)}
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
                onClick={() => goToIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
