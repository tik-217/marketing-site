import { contacts } from '../config/contacts'
import { Button } from './Button'

export function CtaButton({ source, ...props }) {
  const href = source ? `${contacts.botUrl}?start=${source}` : contacts.botUrl

  return (
    <Button href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {contacts.ctaLabel}
    </Button>
  )
}
