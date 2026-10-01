import { contacts } from '../../../shared/config/contacts'
import { canRetry, hasTelegramFallback, messageForError } from '../lib/messages'
import { buildLimitMessage, buildTelegramUrl } from '../lib/telegramLink'

export function AuditErrorPanel({ code, hostname, track, onRetry }) {
  const showRetry = canRetry(code)
  const showTelegram = hasTelegramFallback(code)

  return (
    <div className="audit-error" role="alert">
      <p className="audit-error__text">{messageForError(code)}</p>
      {(showRetry || showTelegram) && (
        <div className="audit-error__actions">
          {showRetry && (
            <button type="button" className="btn" onClick={onRetry}>
              Попробовать снова
            </button>
          )}
          {showTelegram && (
            <a
              className={showRetry ? 'btn btn--outline' : 'btn'}
              href={buildTelegramUrl(contacts.telegramUrl, buildLimitMessage({ hostname }))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('audit_limit_telegram_click', { host: hostname, code })}
            >
              Попросить посмотреть вручную
            </a>
          )}
        </div>
      )}
    </div>
  )
}
