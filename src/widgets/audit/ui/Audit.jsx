import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendTelegramMessage } from '../../../shared/api/telegram'
import { contacts } from '../../../shared/config/contacts'
import { reachGoal } from '../../../shared/lib/analytics/goals'
import { Button, Eyebrow, Section } from '../../../shared/ui'

// Главная: основной путь в Telegram через кнопки страницы, форма запасная для тех, у кого его нет.
const defaultCopy = {
  eyebrow: 'Разбор конкурентов',
  heading: 'Покажу, что обещают ваши конкуренты в Яндексе',
  lead: 'Выберите практику и город. В тот же день пришлю в Telegram объявления конкурентов, слабые места каждого и чем можно отстроиться. Бесплатно, 5 разборов в неделю.',
  hint: 'Нет Telegram? Оставьте телефон или почту, разбор пришлю туда',
  practicePlaceholder: 'Практика и город',
  contactPlaceholder: 'Телефон или почта',
  submitLabel: 'Получить разбор конкурентов',
  submitOutline: true,
  help: 'Отвечу в течение 30 минут.',
}

/**
 * Форма для тех, кто не пользуется Telegram. copy меняет тексты блока и состав формы: без practicePlaceholder
 * поля "Практика и город" нет, а его подсказка подписывает строку в сообщении. pageName попадает в скрытое поле и в сообщение, чтобы заявки со страницы
 * отличались от заявок с главной.
 */
export function Audit({ id, copy = defaultCopy, pageName, telegramHref = contacts.telegramUrl }) {
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const contact = formData.get('contact')?.toString().trim()
    const practice = formData.get('practice')?.toString().trim()
    if (!contact) return

    setIsSubmitting(true)
    setError('')
    try {
      await sendTelegramMessage(
        `Новая заявка с сайта${pageName ? `\nСтраница: ${pageName}` : ''}${practice ? `\n${copy.practicePlaceholder.replace(/\u00a0/g, ' ')}: ${practice}` : ''}\nКонтакт: ${contact}`,
      )
      setSent(true)
      reachGoal('form_submit')
    } catch {
      setError('Не удалось отправить. Напишите напрямую в Telegram.')
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
      </div>

      <form className="audit-form" method="post" action="#" onSubmit={handleSubmit}>
        {sent ? (
          <div className="stack" style={{ gap: 'var(--space-3)', padding: '24px 0' }}>
            <h3 className="audit-form__success-title">Получил. Отвечу в течение 30 минут в рабочее время</h3>
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
            {copy.practicePlaceholder ? (
              <p className="audit-form__hint">{copy.hint}</p>
            ) : (
              <label className="audit-form__hint" htmlFor={`${id}-contact`}>
                {copy.hint}
              </label>
            )}
            {copy.practicePlaceholder && (
              <input
                id={`${id}-practice`}
                type="text"
                name="practice"
                aria-label={copy.practicePlaceholder}
                placeholder={copy.practicePlaceholder}
                className="audit-form__input"
              />
            )}
            <input
              id={`${id}-contact`}
              type="text"
              name="contact"
              inputMode="tel"
              autoComplete="tel"
              aria-label={copy.contactPlaceholder}
              placeholder={copy.contactPlaceholder}
              className="audit-form__input"
              required
            />
            <label className="audit-form__consent">
              <input type="checkbox" name="consent" required />
              <span>
                Согласен на обработку персональных данных и принимаю{' '}
                <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                  политику
                </Link>
              </span>
            </label>
            <Button
              as="button"
              type="submit"
              block
              className={copy.submitOutline ? 'audit-form__submit audit-form__submit--outline' : 'audit-form__submit'}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправляю…' : copy.submitLabel}
            </Button>
            {error ? (
              <p className="audit-form__help" style={{ color: 'var(--accent-700, var(--accent))' }}>
                {error}{' '}
                <a href={telegramHref} target="_blank" rel="noopener noreferrer">
                  {contacts.telegramUrl.replace('https://', '')}
                </a>
              </p>
            ) : (
              <p className="audit-form__help">{copy.help}</p>
            )}
          </>
        )}
      </form>
    </Section>
  )
}
