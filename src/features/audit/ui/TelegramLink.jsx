import { contacts } from '../../../shared/config/contacts'
import { buildTelegramMessage, buildTelegramUrl } from '../lib/telegramLink'

export function TelegramLink({ intent, position, hostname, code, auditId, track, className = '', onOpen, children }) {
  const text = buildTelegramMessage({ intent, hostname, code })

  function handleClick() {
    track('audit_telegram_click', { intent, position, hostname, code, auditId })
    onOpen?.(intent)
  }

  return (
    <a
      href={buildTelegramUrl(contacts.telegramUrl, text)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
