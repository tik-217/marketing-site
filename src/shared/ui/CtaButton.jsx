import { contacts } from '../config/contacts'
import { ctaName } from '../lib/telegramSource'
import { Button } from './Button'

/**
 * Кнопка "Получить разбор": прямой чат в Telegram. source называет блок, из которого ведет кнопка,
 * из него получается data-cta. Цель Метрики tg_click ставит один обработчик на документе (analytics/goals.js).
 */
export function CtaButton({ source, ...props }) {
  return (
    <Button
      href={contacts.chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-cta={source ? ctaName(source) : undefined}
      {...props}
    >
      {contacts.ctaLabel}
    </Button>
  )
}
