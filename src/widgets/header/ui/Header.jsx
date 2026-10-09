import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { contacts } from '../../../shared/config/contacts'
import { InstagramIcon, PhoneIcon, TelegramIcon } from '../../../shared/ui'

export function Header() {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const headerRef = useRef(null)
  const heightRef = useRef(0)
  const { pathname } = useLocation()
  const logoHref = pathname.startsWith('/cases') ? '/#cases' : '/'

  useEffect(() => {
    const element = headerRef.current
    if (!element) return undefined

    const setHeight = () => {
      heightRef.current = element.offsetHeight
      document.documentElement.style.setProperty(
        '--header-height',
        `${hidden ? 0 : heightRef.current}px`,
      )
    }

    setHeight()
    const observer = new ResizeObserver(setHeight)
    observer.observe(element)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--header-height', `${hidden ? 0 : heightRef.current}px`)
  }, [hidden])

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
    <header ref={headerRef} className={hidden ? 'site-header site-header--hidden' : 'site-header'}>
      <div className="container site-header__inner">
        <Link to={logoHref} className="site-header__brand">
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
