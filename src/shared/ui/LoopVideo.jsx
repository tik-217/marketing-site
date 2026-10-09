import { useEffect, useRef, useSyncExternalStore } from 'react'

const VIDEO_SRC = '/media/hero-reel.mp4'
const POSTER_SRC = '/media/hero-poster.jpg'

function subscribeReducedMotion(onChange) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Беззвучный зацикленный ролик. При "уменьшить анимацию" остается первый кадр. */
export function LoopVideo({ className }) {
  const ref = useRef(null)
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (reduceMotion) video.pause()
    else video.play().catch(() => {}) // часть браузеров откладывает autoplay, запускаем явно
  }, [reduceMotion])

  return (
    <video
      ref={ref}
      className={className}
      poster={POSTER_SRC}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>
  )
}
