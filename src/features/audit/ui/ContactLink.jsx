export function ContactLink({ intent, position, hostname, code, auditId, track, className = '', onOpen, children }) {
  function handleClick() {
    track('audit_form_open_click', { intent, position, hostname, code, auditId })
    onOpen?.(intent)
  }

  return (
    <a
      href="/#razbor"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
