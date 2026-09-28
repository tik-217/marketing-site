import { Link } from 'react-router-dom'
import { contacts } from '../../../shared/config/contacts'
import { CtaButton, InstagramIcon, TelegramIcon } from '../../../shared/ui'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__top">
          <Link to="/" className="site-footer__brand">
            <span className="site-header__name">Габулян Тигран</span>
            <span className="site-header__divider">|</span>
            <span className="site-header__role">Маркетолог</span>
          </Link>
          <CtaButton source="s-footer" className="site-footer__cta" />
        </div>

        <div className="site-footer__row">
          <nav className="site-footer__nav">
            <Link to="/privacy">Политика данных</Link>
          </nav>
          <div className="site-footer__contacts">
            <a href="tel:+79180220901" className="site-footer__phone">
              {contacts.phone}
            </a>
            <a href={contacts.telegramUrl} target="_blank" rel="noopener noreferrer" className="social-link">
              <TelegramIcon />
              <span>Telegram</span>
            </a>
            <a href={contacts.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-link">
              <InstagramIcon />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        <p className="site-footer__legal">Габулян Тигран Давидович, самозанятый (НПД), ИНН 010401519537</p>
      </div>
    </footer>
  )
}
