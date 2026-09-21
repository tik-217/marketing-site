import { Link } from 'react-router-dom'
import { contacts } from '../../../shared/config/contacts'
import { InstagramIcon, TelegramIcon } from '../../../shared/ui'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span className="site-footer__brand">
          <span className="site-header__name">Габулян Тигран</span>
          <span className="site-header__divider">|</span>
          <span className="site-header__role">Маркетолог</span>
        </span>
        <span className="site-footer__spacer" />
        <Link to="/privacy" className="site-footer__phone">Политика данных</Link>
        <a href={'tel:+79180220901'} className="site-footer__phone">{contacts.phone}</a>
        <a href={contacts.telegramUrl} target="_blank" rel="noopener noreferrer" className="social-link">
          <TelegramIcon />
          <span>Telegram</span>
        </a>
        <a
          href={contacts.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <InstagramIcon />
          <span>Instagram</span>
        </a>
      </div>
    </footer>
  )
}
