import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendTelegramMessage } from '../../../shared/api/telegram'
import { reachGoal } from '../../../shared/lib/analytics/goals'
import { Button } from '../../../shared/ui'

export function ContactForm({ id, help = 'Отвечу в течение 30 минут. План пришлю в течение 24 часов.', pageName }) {
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const contact = formData.get('phone')?.toString().trim()
    if (!contact || !/^[+0-9().\s-]+$/.test(contact) || contact.replace(/\D/g, '').length < 10 || contact.replace(/\D/g, '').length > 15) {
      setError('Введите номер телефона: от 10 до 15 цифр.')
      return
    }

    setIsSubmitting(true)
    setError('')
    try {
      await sendTelegramMessage(`Новая заявка с сайта${pageName ? `\nСтраница: ${pageName}` : ''}\nТелефон: ${contact}`)
      setSent(true)
      reachGoal('form_submit')
    } catch {
      setError('Не удалось отправить. Позвоните по номеру +7 918 022-09-01.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="audit-form" method="post" action="#" onSubmit={handleSubmit}>
        {sent ? (
          <div className="stack" style={{ gap: 'var(--space-3)', padding: '24px 0' }}>
            <h3 className="audit-form__success-title">Получил. Отвечу в течение 30 минут в рабочее время</h3>
          </div>
        ) : (
          <>
            {pageName && <input type="hidden" name="page" value={pageName} />}
            <label className="audit-form__hint" htmlFor={`${id}-contact`}>
              Оставьте номер телефона
            </label>
            <input
              id={`${id}-contact`}
              type="tel"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Номер телефона"
              className="audit-form__input"
              required
              maxLength={24}
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
                {error}
              </p>
            ) : (
              <p className="audit-form__help">{help}</p>
            )}
          </>
        )}
    </form>
  )
}
