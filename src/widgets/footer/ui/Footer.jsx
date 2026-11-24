import { Link, useLocation } from 'react-router-dom'
import { contacts } from '../../../shared/config/contacts'
import { CtaButton } from '../../../features/contact-cta'

/**
 * chat: для страницы /bankrotstvo свой адрес чата, подпись и название блока для кнопки и ссылки Telegram.
 */
export function Footer({ chat, homeHref = '/' }) {
  const { pathname } = useLocation()

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__top">
          <Link to={homeHref} className="site-footer__brand">
            <span className="site-header__name">Габулян Тигран</span>
            <span className="site-header__divider">|</span>
            <span className="site-header__role">Маркетолог</span>
          </Link>
          <CtaButton
            source={chat?.source ?? (pathname.startsWith('/audit') ? 's-audit-footer' : 's-footer')}
            href={chat?.href}
            label={chat?.label}
            className="site-footer__cta"
          />
        </div>

        <div className="site-footer__row">
          <nav className="site-footer__nav">
            <Link to="/privacy">Политика данных</Link>
          </nav>
          <div className="site-footer__contacts">
            <a href="tel:+79180220901" className="site-footer__phone">
              {contacts.phone}
            </a>
          </div>
        </div>

        <p className="site-footer__legal">Габулян Тигран Давидович, самозанятый (НПД), ИНН 010401519537</p>
      </div>
    </footer>
  )
}
