import { useEffect, useRef } from 'react'
import { CtaButton } from '../../../shared/ui'

/** Главный экран: видео на весь экран за текстом. */
export function Hero() {
  const videoRef = useRef(null)

  // Пользователям с "уменьшить анимацию" видео не проигрываем: остается первый кадр.
  // Остальным запускаем явно: часть браузеров откладывает autoplay, например при возврате на вкладку.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) video.pause()
    else video.play().catch(() => {})
  }, [])

  return (
    <section className="hero">
      <video
        ref={videoRef}
        className="hero__video"
        src="/media/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="hero__shade" aria-hidden="true" />
      <div className="container hero__content">
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
    </section>
  )
}
