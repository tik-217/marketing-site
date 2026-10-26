import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { contacts } from '../../../shared/config/contacts'
import { InstagramIcon, PhoneIcon, TelegramIcon } from '../../../shared/ui'

/**
 * telegram: свой адрес и название блока для иконки Telegram (на странице /bankrotstvo), по умолчанию общий чат.
 * homeHref: куда ведет логотип. У /bankrotstvo своя главная, это она сама.
 */
export function Header({ telegram, homeHref = '/' }) {
  const headerRef = useRef(null)
  const heightRef = useRef(0)
  const { pathname } = useLocation()
  const logoHref = homeHref === '/' && pathname.startsWith('/cases') ? '/#cases' : homeHref

  // Шапка всегда на виду, ее высота нужна первому экрану (--header-height).
  useEffect(() => {
    const element = headerRef.current
    if (!element) return undefined

    const setHeight = () => {
      heightRef.current = element.offsetHeight
      document.documentElement.style.setProperty('--header-height', `${heightRef.current}px`)
    }

    setHeight()
    const observer = new ResizeObserver(setHeight)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <header ref={headerRef} className="site-header">
      <div className="container site-header__inner">
        <Link to={logoHref} className="site-header__brand" onClick={() => pathname === logoHref && window.scrollTo(0, 0)}>
          <span className="site-header__name">Габулян Тигран</span>
          <span className="site-header__divider">|</span>
          <span className="site-header__role">Маркетолог</span>
        </Link>
        <span className="site-header__spacer" />
        <div className="site-header__socials">
          <a href="tel:+79180220901" className="social-link site-header__phone" aria-label={`Позвонить ${contacts.phone}`}>
            <PhoneIcon />
            <span>{contacts.phone}</span>
          </a>
          <a
            href={telegram?.href ?? contacts.telegramUrl}
            data-cta={telegram?.block}
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
