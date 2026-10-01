import { useState } from 'react'
import { buildTelegramMessage } from '../lib/telegramLink'
import { TelegramLink } from './TelegramLink'

/** Блок после списка приоритетов. Как в макете, виден только на узких экранах. */
export function MidCta({ hostname, code, auditId, track }) {
  return (
    <aside className="ad-mid">
      <p>Помогу расставить эти пункты по порядку под ваш бюджет.</p>
      <TelegramLink
        intent="deeper"
        position="actions"
        hostname={hostname}
        code={code}
        auditId={auditId}
        track={track}
        className="ad-btn"
      >
        Обсудить разбор в Telegram
      </TelegramLink>
    </aside>
  )
}

/** Главный блок после результата: Telegram. */
export function FinalCta({ hostname, code, auditId, track }) {
  const [copied, setCopied] = useState(false)

  async function copyMessage() {
    track('audit_copy_message', { intent: 'deeper', hostname, code, auditId })
    try {
      await navigator.clipboard.writeText(buildTelegramMessage({ intent: 'deeper', hostname, code }))
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="ad-final" aria-labelledby="ad-final-title">
      <h2 id="ad-final-title" className="ad-h2 ad-final__title">
        Следующий шаг: посмотреть страницу вместе с рекламой
      </h2>
      <p className="ad-final__text">
        Разбор видит только страницу. Я могу посмотреть сайт вместе с рекламой и аналитикой и
        показать, на каком этапе уходят обращения.
      </p>
      <TelegramLink
        intent="deeper"
        position="final"
        hostname={hostname}
        code={code}
        auditId={auditId}
        track={track}
        className="ad-btn ad-final__btn"
      >
        Написать в Telegram
      </TelegramLink>
      <p className="ad-final__note">
        Разбор построен по публичной странице на момент проверки. Он не учитывает рекламу,
        аналитику и данные о заявках и не гарантирует результат.
      </p>
      <p className="ad-final__note">
        Если сообщение в Telegram не подставилось, его можно{' '}
        <button type="button" className="ad-final__copy" onClick={copyMessage}>
          скопировать
        </button>
        .<span role="status">{copied ? ' Скопировано.' : ''}</span>
      </p>
    </section>
  )
}
