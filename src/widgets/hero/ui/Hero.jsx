import { useEffect, useRef, useSyncExternalStore } from 'react'
import { CtaButton } from '../../../shared/ui'

const VIDEO_SRC = '/media/hero-reel.mp4'
const POSTER_SRC = '/media/hero-poster.jpg'

function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Беззвучный зацикленный ролик. При "уменьшить анимацию" остается первый кадр. */
function LoopVideo({ className, preload = 'metadata' }) {
  const ref = useRef(null)
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

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
      preload={preload}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>
  )
}

/** Главный экран: текст слева, вертикальный ролик в рамке справа, за ними размытый тот же ролик. */
export function Hero() {
  // Размытый фон только на широких экранах и без "уменьшить анимацию": на телефоне второй ролик не грузим.
  const showBackdrop = useMediaQuery('(min-width: 769px) and (prefers-reduced-motion: no-preference)')

  return (
    <section className="hero">
      {showBackdrop && (
        <div className="hero__bg" aria-hidden="true">
          <LoopVideo className="hero__bg-video" preload="none" />
        </div>
      )}
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__headline">Привожу клиентов для юридических ниш через комплексный маркетинг</h1>
          <p className="hero__lead">
            За проект берусь лично я. Изучаю вашу нишу, потом собираю сайт, рекламу и Telegram в одну систему, по которой к вам приходят обращения
          </p>
          <div className="hero__cta">
            <CtaButton source="s-hero" />
            <p className="hero__help">
              Бесплатно пришлю документ с правками по сайту и рекламе. Перед этим задам пять вопросов в Telegram-боте.
            </p>
          </div>
        </div>
        <div className="hero__video">
          <LoopVideo className="hero__video-el" />
        </div>
      </div>
    </section>
  )
}
