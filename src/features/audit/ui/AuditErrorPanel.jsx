import { canRetry, messageForError } from '../lib/messages'

const views = {
  RATE_LIMITED: {
    eyebrow: 'Дневной лимит',
    title: 'На сегодня проверки закончились',
    text: 'На сегодня лимит бесплатных аудитов исчерпан. Новые проверки будут доступны завтра. Если разбор нужен сейчас, оставьте заявку, посмотрю страницу сам.',
    primaryContact: true,
  },
  AUDIT_TEMPORARILY_UNAVAILABLE: {
    eyebrow: 'Разбор не готов',
    title: 'Не получилось открыть страницу',
    text: 'Страница не ответила или не показала содержимое. Так бывает, если сайт временно недоступен, закрыт паролем или не пускает автоматические проверки. Проверьте, что страница открывается в браузере, и запустите разбор еще раз.',
  },
  AUDIT_BUSY: { eyebrow: 'Разбор не готов', title: 'Сейчас много проверок' },
  AUDIT_NOT_AVAILABLE: { eyebrow: 'Разбор не готов', title: 'Сервис временно недоступен', primaryContact: true },
  NETWORK_ERROR: { eyebrow: 'Разбор не готов', title: 'Нет связи с сервисом' },
}

views.AUDIT_LIMIT_REACHED = views.RATE_LIMITED

const fallbackView = { eyebrow: 'Разбор не готов', title: 'Не получилось завершить разбор' }

/** Страница-состояние вместо формы: ошибка или дневной лимит. */
export function AuditErrorPanel({ code, hostname, displayUrl, track, onRetry, onNewSite }) {
  const view = views[code] ?? fallbackView
  const text = view.text ?? messageForError(code)

  return (
    <section className="ad-state" role="alert">
      <div className="ad-state__in">
        <span className="ad-eyebrow ad-eyebrow--muted">{view.eyebrow}</span>
        <h1 className="ad-h1 ad-state__title">{view.title}</h1>
        <p className="ad-state__text">{text}</p>
        {!view.primaryContact && displayUrl && <div className="ad-state__url">{displayUrl}</div>}
        <div className="ad-state__actions">
          {canRetry(code) && (
            <button type="button" className="ad-btn" onClick={onRetry}>
              Попробовать еще раз
            </button>
          )}
          <a
            className={view.primaryContact ? 'ad-btn ad-state__btn' : 'ad-link'}
            href="/#razbor"
            onClick={() => track('audit_limit_form_open_click', { hostname, code })}
          >
            Оставить заявку
          </a>
          <button type="button" className="ad-linkbutton" onClick={onNewSite}>
            Проверить другую страницу
          </button>
        </div>
      </div>
    </section>
  )
}
