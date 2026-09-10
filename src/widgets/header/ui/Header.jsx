import { useEffect, useRef, useState } from 'react'
import { contacts } from '../../../shared/config/contacts'
import { InstagramIcon, TelegramIcon } from '../../../shared/ui'

export function Header() {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    function onScroll() {
      const y = window.scrollY
      const diff = y - lastY.current

      if (y < 80) {
        setHidden(false)
      } else if (diff > 4) {
        setHidden(true)
      } else if (diff < -4) {
        setHidden(false)
      }

      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={hidden ? 'site-header site-header--hidden' : 'site-header'}>
      <div className="container site-header__inner">
        <span className="site-header__name">Габулян Тигран</span>
        <span className="site-header__divider">|</span>
        <span className="site-header__role">Маркетолог</span>
        <span className="site-header__spacer" />
        <div className="site-header__socials">
          <a
            href={contacts.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link social-link--icon"
            aria-label="Telegram Тиграна Габуляна"
          >
            <TelegramIcon />
          </a>
          <a
            href={contacts.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link social-link--icon"
            aria-label="Instagram Тиграна Габуляна"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
    </header>
  )
}
