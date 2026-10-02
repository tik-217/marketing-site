import { useCallback, useState } from 'react'
import { buildReportUrl, copyText } from '../lib/reportLink.js'

/**
 * Копирование постоянной ссылки на отчет. Событие аналитики без id отчета отправляет вызывающий код.
 * "Скопировано" привязано к конкретному отчету: у нового результата оно не остается.
 */
export function useCopyLink({ reportId, onCopy }) {
  const [copiedFor, setCopiedFor] = useState('')

  const copyLink = useCallback(async () => {
    if (!reportId) return false
    onCopy?.()
    const ok = await copyText(buildReportUrl(reportId))
    if (ok) {
      setCopiedFor(reportId)
      setTimeout(() => setCopiedFor((current) => (current === reportId ? '' : current)), 2500)
    }
    return ok
  }, [reportId, onCopy])

  return { copied: Boolean(reportId) && copiedFor === reportId, copyLink }
}
