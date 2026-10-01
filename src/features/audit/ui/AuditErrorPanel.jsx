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
  AUDIT_BUSY: { eyebrow: 'Разбор не готов', title: 'Сейчас много проверок' },
  AUDIT_NOT_AVAILABLE: { eyebrow: 'Разбор не готов', title: 'Сервис временно недоступен', primaryTelegram: true },
  NETWORK_ERROR: { eyebrow: 'Разбор не готов', title: 'Нет связи с сервисом' },
}

views.AUDIT_LIMIT_REACHED = views.RATE_LIMITED

const fallbackView = { eyebrow: 'Разбор не готов', title: 'Не получилось завершить разбор' }

/** Страница-состояние вместо формы: ошибка или дневной лимит. */
export function AuditErrorPanel({ code, hostname, displayUrl, track, onRetry, onNewSite }) {
  const view = views[code] ?? fallbackView
  const text = view.text ?? messageForError(code)
  const telegramUrl = buildTelegramUrl(contacts.telegramUrl, buildLimitMessage({ hostname }))

  return (
    <section className="ad-state" role="alert">
      <div className="ad-state__in">
        <span className="ad-eyebrow ad-eyebrow--muted">{view.eyebrow}</span>
        <h1 className="ad-h1 ad-state__title">{view.title}</h1>
        <p className="ad-state__text">{text}</p>
        {!view.primaryTelegram && displayUrl && <div className="ad-state__url">{displayUrl}</div>}
        <div className="ad-state__actions">
          {canRetry(code) && (
            <button type="button" className="ad-btn" onClick={onRetry}>
              Попробовать еще раз
            </button>
          )}
          <a
            className={view.primaryTelegram ? 'ad-btn ad-state__btn' : 'ad-link'}
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('audit_limit_telegram_click', { hostname, code })}
          >
            Написать в Telegram
          </a>
          <button type="button" className="ad-linkbutton" onClick={onNewSite}>
            Проверить другую страницу
          </button>
        </div>
      </div>
    </section>
  )
}
