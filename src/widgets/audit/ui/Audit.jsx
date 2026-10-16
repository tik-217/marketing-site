import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendTelegramMessage } from '../../../shared/api/telegram'
import { contacts } from '../../../shared/config/contacts'
import { reachGoal } from '../../../shared/lib/analytics/goals'
import { Button, CtaButton, Eyebrow, Section } from '../../../shared/ui'

const defaultCopy = {
  eyebrow: 'Аудит',
  heading: 'Покажу, где ваш сайт и реклама теряют заявки',
  lead: 'Пришлите ссылку на сайт или на кабинет Директа. Посмотрю их вместе с конкурентами и вернусь со списком точек роста. Бесплатно и без обязательств.',
}

/**
 * Форма для тех, кто не пользуется Telegram. copy меняет тексты блока, cta добавляет кнопку в Telegram,
 * pageName попадает в скрытое поле и в сообщение, чтобы заявки со страницы отличались от заявок с главной.
 */
export function Audit({ id, copy = defaultCopy, cta, pageName, telegramHref = contacts.telegramUrl, showAuditLink = true }) {
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const contact = formData.get('contact')?.toString().trim()
    if (!contact) return

    setIsSubmitting(true)
    setError('')
    try {
      await sendTelegramMessage(`Новая заявка с сайта${pageName ? `\nСтраница: ${pageName}` : ''}\nКонтакт: ${contact}`)
      setSent(true)
      reachGoal('form_submit')
    } catch {
      setError('Не удалось отправить. Напишите напрямую в Telegram.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Section id={id} inverse containerClassName="audit">
      <div className="audit__copy">
        <Eyebrow inverse>{copy.eyebrow}</Eyebrow>
        <h2 className="audit__heading">{copy.heading}</h2>
        <p className="audit__lead">{copy.lead}</p>
        {cta && <CtaButton source={cta.source} href={cta.href} label={cta.label} className="audit__cta" />}
      </div>

      <form className="audit-form" method="post" action="#" onSubmit={handleSubmit}>
        {sent ? (
          <div className="stack" style={{ gap: 'var(--space-3)', padding: '24px 0' }}>
            <h3 className="audit-form__success-title">Получил. Отвечу в течение 30 минут в рабочее время</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Если срочно, напишите в{' '}
              <a href={telegramHref} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </p>
          </div>
        ) : (
          <>
            {pageName && <input type="hidden" name="page" value={pageName} />}
            <label className="audit-form__hint" htmlFor={`${id}-contact`}>
              Если не пользуетесь Telegram, оставьте телефон или почту
            </label>
            <input
              id={`${id}-contact`}
              type="text"
              name="contact"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Телефон, Telegram или почта"
              className="audit-form__input"
              required
            />
            <label className="audit-form__consent">
              <input type="checkbox" name="consent" required />
              <span>
                Согласен на обработку персональных данных и принимаю{' '}
                <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                  политику
                </Link>
              </span>
            </label>
            <Button as="button" type="submit" block className="audit-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Отправляю…' : 'Оставить контакт, свяжусь сам'}
            </Button>
            {error ? (
              <p className="audit-form__help" style={{ color: 'var(--accent-700, var(--accent))' }}>
                {error}{' '}
                <a href={telegramHref} target="_blank" rel="noopener noreferrer">
                  {contacts.telegramUrl.replace('https://', '')}
                </a>
              </p>
            ) : (
              <p className="audit-form__help">Отвечу в течение 30 минут. Документ пришлю в течение 24 часов после доступов.</p>
            )}
            {showAuditLink && (
              <p className="audit-form__help">
                Хотите сначала проверить сайт сами?{' '}
                <Link to="/audit">Автоматический разбор за 30 секунд →</Link>
              </p>
            )}
          </>
        )}
      </form>
    </Section>
  )
}
