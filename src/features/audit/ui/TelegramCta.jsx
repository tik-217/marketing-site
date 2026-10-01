import { useState } from 'react'
import { buildTelegramMessage } from '../lib/telegramLink'
import { TelegramLink } from './TelegramLink'

/** Светлый блок с одной кнопкой: после итога и после списка приоритетов. */
export function CtaBlock({ text, label, position, hostname, code, auditId, track }) {
  return (
    <aside className="ad-cta">
      <p className="ad-cta__text">{text}</p>
      <TelegramLink
        intent="deeper"
        position={position}
        hostname={hostname}
        code={code}
        auditId={auditId}
        track={track}
        className="btn ad-cta__btn"
      >
        {label}
      </TelegramLink>
    </aside>
  )
}

/** Единственный темный блок страницы: итоговый шаг. */
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
      <h2 id="ad-final-title" className="ad-final__title">
        Следующий шаг: посмотреть страницу вместе с рекламой
      </h2>
      <p className="ad-final__text">
        Разбор видит только страницу. Я могу посмотреть сайт вместе с рекламой и аналитикой и
        показать, на каком этапе уходят обращения.
      </p>
      <div>
        <TelegramLink
          intent="deeper"
          position="final"
          hostname={hostname}
          code={code}
          auditId={auditId}
          track={track}
          className="btn ad-final__btn"
        >
          Написать в Telegram
        </TelegramLink>
      </div>
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
