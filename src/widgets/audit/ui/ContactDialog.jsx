import { useEffect, useRef, useState } from 'react'
import { ContactForm } from './ContactForm'
import { reachGoal } from '../../../shared/lib/analytics/goals'

// Обычные ссылки остаются рабочим запасным вариантом, если JavaScript отключен.
export function ContactDialog() {
  const dialogRef = useRef(null)
  const sourceRef = useRef('')
  const [pageName, setPageName] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || !((url.pathname === '/' && url.hash === '#razbor') || (url.pathname === '/bankrotstvo' && url.hash === '#audit'))) return
      event.preventDefault()
      sourceRef.current = link.getAttribute('data-cta') || ''
      setPageName(window.location.pathname)
      setOpen(true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (open && !dialogRef.current.open) {
      dialogRef.current.showModal()
      reachGoal('form_open', sourceRef.current ? { block: sourceRef.current } : undefined)
    }
  }, [open])

  return (
    <dialog ref={dialogRef} className="contact-dialog" aria-labelledby="contact-dialog-title" onClose={() => setOpen(false)}>
      <button type="button" className="contact-dialog__close" aria-label="Закрыть" onClick={() => dialogRef.current.close()}>×</button>
      <h2 id="contact-dialog-title" className="contact-dialog__title">Получить бесплатный разбор</h2>
      {open && <ContactForm id="contact-dialog" pageName={pageName} />}
    </dialog>
  )
}
