import { contacts } from '../../../shared/config/contacts'
import { canRetry, messageForError } from '../lib/messages'
import { buildLimitMessage, buildTelegramUrl } from '../lib/telegramLink'

const views = {
  RATE_LIMITED: {
    eyebrow: 'Дневной лимит',
    title: 'На сегодня проверки закончились',
    text: 'На сегодня лимит бесплатных аудитов исчерпан. Новые проверки будут доступны завтра. Если разбор нужен сейчас, пришлите ссылку в Telegram, посмотрю страницу сам.',
    primaryTelegram: true,
  },
  AUDIT_TEMPORARILY_UNAVAILABLE: {
    eyebrow: 'Разбор не готов',
    title: 'Не получилось открыть страницу',
    text: 'Страница не ответила или не показала содержимое. Так бывает, если сайт временно недоступен, закрыт паролем или не пускает автоматические проверки. Проверьте, что страница открывается в браузере, и запустите разбор еще раз.',
  },
  AUDIT_BUSY: {
    eyebrow: 'Разбор не готов',
    title: 'Сейчас много проверок',
  },
  AUDIT_NOT_AVAILABLE: {
    eyebrow: 'Разбор не готов',
    title: 'Сервис временно недоступен',
    primaryTelegram: true,
  },
  NETWORK_ERROR: {
    eyebrow: 'Разбор не готов',
    title: 'Нет связи с сервисом',
  },
}

const fallbackView = {
  eyebrow: 'Разбор не готов',
  title: 'Не получилось завершить разбор',
}

/** Страница-состояние вместо формы: ошибка или дневной лимит. */
export function AuditErrorPanel({ code, hostname, displayUrl, track, onRetry, onNewSite }) {
  const view = views[code] ?? fallbackView
  const text = view.text ?? messageForError(code)
  const showRetry = canRetry(code)
  const telegramUrl = buildTelegramUrl(contacts.telegramUrl, buildLimitMessage({ hostname }))
  const telegramClass = view.primaryTelegram ? 'btn' : 'ad-state__link'

  return (
    <div className="ad-state" role="alert">
      <span className="ad-eyebrow">{view.eyebrow}</span>
      <h1 className="ad-h1 ad-h1--state">{view.title}</h1>
      <p className="ad-lead">{text}</p>
      {!view.primaryTelegram && displayUrl && (
        <input className="audit-start__input ad-state__url" type="text" value={displayUrl} readOnly aria-label="Проверяемая страница" />
      )}
      <div className="ad-state__actions">
        {showRetry && (
          <button type="button" className="btn" onClick={onRetry}>
            Попробовать еще раз
          </button>
        )}
        <a
          className={telegramClass}
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('audit_limit_telegram_click', { hostname, code })}
        >
          Написать в Telegram
        </a>
        <button type="button" className="audit-linkbutton" onClick={onNewSite}>
          Проверить другую страницу
        </button>
      </div>
    </div>
  )
}
