import { contacts } from '../../../shared/config/contacts'

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
        <a href={'tel:+79180220901'} className="site-footer__phone">{contacts.phone}</a>
        <a href={contacts.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-link">
          Telegram
        </a>
      </div>
    </footer>
  )
}
