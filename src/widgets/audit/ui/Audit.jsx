import { useState } from 'react'
import { sendTelegramMessage } from '../../../shared/api/telegram'
import { contacts } from '../../../shared/config/contacts'
import { Button, Eyebrow, Section } from '../../../shared/ui'

export function Audit({ id }) {
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const contact = new FormData(event.target).get('contact')?.toString().trim()
    if (!contact) return

    setIsSubmitting(true)
    setError('')
    try {
      await sendTelegramMessage(`Новая заявка с сайта\nКонтакт: ${contact}`)
      setSent(true)
    } catch {
      setError('Не удалось отправить. Напишите напрямую в Telegram.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Section id={id} inverse containerClassName="audit">
      <div className="audit__copy">
        <Eyebrow inverse>Аудит</Eyebrow>
        <h2 className="audit__heading">Проведу аудит за 24 час перед стартом работ</h2>
        <p className="audit__lead">
            Посмотрю ваш сайт, рекламу и конкурентов, покажу места, где теряется клиенты.
        </p>
      </div>

      <form className="audit-form" onSubmit={handleSubmit}>
        {sent ? (
          <div className="stack" style={{ gap: 'var(--space-3)', padding: '24px 0' }}>
            <h3 className="audit-form__success-title">Заявка отправлена</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Отвечаю в течение 30-ти минут.</p>
          </div>
        ) : (
          <>
            <h3 className="audit-form__title">Выявить точки роста за 24 часа</h3>
            <input
              type="text"
              name="contact"
              placeholder="Телефон или ник в телеграме"
              className="audit-form__input"
              required
            />
            <Button as="button" type="submit" block className="audit-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Отправляю…' : contacts.ctaLabel}
            </Button>
            {error ? (
              <p className="audit-form__help" style={{ color: 'var(--accent-700, var(--accent))' }}>
                {error}{' '}
                <a href={contacts.telegramUrl} target="_blank" rel="noopener noreferrer">
                  {contacts.telegramUrl.replace('https://', '')}
                </a>
              </p>
            ) : (
              <p className="audit-form__help">Отвечаю в течение 30-ти минут.</p>
            )}
          </>
        )}
      </form>
    </Section>
  )
}
