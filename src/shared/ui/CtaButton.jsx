import { contacts } from '../config/contacts'
import { Button } from './Button'

export function CtaButton(props) {
  return (
    <Button href={contacts.botUrl} target="_blank" rel="noopener noreferrer" {...props}>
      {contacts.ctaLabel}
    </Button>
  )
}
