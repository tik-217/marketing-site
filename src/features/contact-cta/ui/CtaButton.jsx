import { contacts } from '../../../shared/config/contacts'
import { ctaName } from '../../../shared/lib/ctaSource'
import { Button } from '../../../shared/ui'

/**
 * Кнопка заявки. source задает название блока для события открытия формы.
 */
export function CtaButton({ source, href = contacts.chatUrl, label = contacts.ctaLabel, ...props }) {
  return (
    <Button
      href={href}
      data-cta={source ? ctaName(source) : undefined}
      {...props}
    >
      {label}
    </Button>
  )
}
