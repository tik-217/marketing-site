import { useState } from 'react'
import { TelegramIcon } from '../../../shared/ui'
import { buildTelegramMessage, intents } from '../lib/telegramLink'
import { TelegramLink } from './TelegramLink'

const secondary = ['ads', 'fixes', 'question']

export function TelegramCta({ hostname, code, track, hasFindings }) {
  const [intent, setIntent] = useState('deeper')
  const [copied, setCopied] = useState(false)

  async function copyMessage() {
    track('audit_copy_message', { intent, host: hostname, code })
    try {
      await navigator.clipboard.writeText(buildTelegramMessage({ intent, hostname, code }))
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="audit-cta" aria-labelledby="audit-cta-title">
      <h2 id="audit-cta-title" className="audit-cta__title">
        Хотите разобрать сайт глубже?
      </h2>
      <p className="audit-cta__text">
        {hasFindings
          ? 'Если хотите посмотреть не только страницу, но и рекламу, аналитику и весь путь заявки до продажи, напишите мне в Telegram.'
          : 'Страница выглядит собранной. Если хотите посмотреть рекламу, аналитику и весь путь заявки до продажи, напишите мне в Telegram.'}
      </p>
      <div className="audit-cta__main">
        <TelegramLink
          intent="deeper"
          position="final"
          hostname={hostname}
          code={code}
          track={track}
          onOpen={setIntent}
          className="btn"
        >
          <TelegramIcon className="audit-cta__icon" />
          {intents.deeper.label}
        </TelegramLink>
      </div>
      <div className="audit-cta__intents">
        <span className="audit-cta__intents-label">Или сразу напишите, что хотите обсудить:</span>
        <ul className="audit-cta__intent-list">
          {secondary.map((key) => (
            <li key={key}>
              <TelegramLink
                intent={key}
                position="final"
                hostname={hostname}
                code={code}
                track={track}
                onOpen={setIntent}
                className="audit-chip"
              >
                {intents[key].label}
              </TelegramLink>
            </li>
          ))}
        </ul>
      </div>
      <p className="audit-cta__copy">
        Если сообщение в Telegram не подставилось, его можно{' '}
        <button type="button" className="audit-linkbutton" onClick={copyMessage}>
          скопировать
        </button>
        .
        <span role="status" className="audit-cta__copied">
          {copied ? ' Скопировано.' : ''}
        </span>
      </p>
    </section>
  )
}
