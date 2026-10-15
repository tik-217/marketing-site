import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const VIDEO_SRC = '/media/hero-reel.mp4'
const POSTER_SRC = '/media/hero-poster.jpg'

function subscribeReducedMotion(onChange) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Беззвучный зацикленный ролик. Файл (около 3 МБ) и постер начинают грузиться, только когда блок
 * подходит к экрану: иначе ролик ниже первого экрана тянет канал и тормозит главную картинку и текст.
 * При "уменьшить анимацию" остается первый кадр.
 */
export function LoopVideo({ className }) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false)

  useEffect(() => {
    const element = ref.current
    if (!element || near) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin: '300px 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [near])

  useEffect(() => {
    const video = ref.current
    if (!video || !near) return
    if (reduceMotion) video.pause()
    else video.play().catch(() => {}) // часть браузеров откладывает autoplay, запускаем явно
  }, [reduceMotion, near])

  return (
    <video
      // при смене near элемент создается заново: ролик с источником начинает грузиться только сейчас
      key={near ? 'loading' : 'idle'}
      ref={ref}
      className={className}
      poster={near ? POSTER_SRC : undefined}
      autoPlay={near}
      muted
      loop
      playsInline
      preload={near ? 'metadata' : 'none'}
      aria-hidden="true"
      tabIndex={-1}
    >
      {near && <source src={VIDEO_SRC} type="video/mp4" />}
    </video>
  )
}
